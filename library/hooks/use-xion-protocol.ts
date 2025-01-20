import { useAbstraxionAccount, useAbstraxionSigningClient } from "@burnt-labs/abstraxion";
import { useCallback, useReducer } from "react";
import { useQuery } from "@tanstack/react-query";
// import { useAbstraxionSigningClient, useAbstraxionClient, useAbstraxionAccount } from "@burnt-labs/abstraxion";
// //import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

// Contract addresses - replace with your deployed contract addresses
const CORE_CONTRACT = "xion1..."; // Core factory contract address
const POLL_CONTRACT = "xion1..."; // Poll contract address

interface QueryState {
  marketParams: {
    page: number;
    limit: number;
  };
  pollAddress?: string;
}

const initialState: QueryState = {
  marketParams: {
    page: 1,
    limit: 10,
  },
};

interface FunctionParams {
  createPoll: {
    question: string;
    avatar: string;
    rule: string;
    description: string;
    duration: bigint;
    yesTokenName: string;
    yesTokenSymbol: string;
    noTokenName: string;
    noTokenSymbol: string;
  };
  stake: {
    pollAddress: string;
    amount: string;
    position: boolean;
  };
  withdrawStake: {
    pollAddress: string;
  };
}

const queryReducer = (state: QueryState, action: any) => {
  switch (action.type) {
    case "UPDATE_PARAMS":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export const useXionProtocol = () => {
  const { data: account } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();
  const [state, dispatch] = useReducer(queryReducer, initialState);

  // Query fetcher functions
  const fetchMarkets = useCallback(async () => {
    if (!client) return [];
    
    const response = await client.queryContractSmart(CORE_CONTRACT, {
      get_poll_count: {},
    });

    const polls = [];
    for (let i = 0; i < response.count; i++) {
      const pollResponse = await client.queryContractSmart(CORE_CONTRACT, {
        get_poll_at: { index: i },
      });
      
      if (pollResponse.address) {
        const pollDetails = await client.queryContractSmart(pollResponse.address, {
          get_poll_info: {},
        });

        // Transform data with additional fields
        polls.push({
          ...pollDetails,
          address: pollResponse.address,
          status: pollDetails.is_resolved ? "resolved" : "active",
          poolSize: pollDetails.total_staked,
          endDate: pollDetails.end_time,
          recentActivity: [], // TODO: Implement activity tracking
        });
      }
    }
    return polls;
  }, [client]);

  const fetchPoll = useCallback(async () => {
    if (!client || !state.pollAddress) return null;
    
    const pollDetails = await client.queryContractSmart(state.pollAddress, {
      get_poll_info: {},
    });

    return {
      ...pollDetails,
      address: state.pollAddress,
      status: pollDetails.is_resolved ? "resolved" : "active",
    };
  }, [client, state.pollAddress]);

  const fetchPollActivities = useCallback(async (pollAddress: string) => {
    if (!client) return [];
    
    const activities = await client.queryContractSmart(pollAddress, {
      get_activities: {
        limit: 10
      }
    });

    return activities.map((activity: any) => ({
      id: `${activity.block_height}-${activity.timestamp}`,
      user: activity.user,
      action: activity.activity_type.toLowerCase(),
      choice: activity.position ? "yes" : "no",
      amount: activity.amount,
      timestamp: activity.timestamp * 1000,
      // ... other mappings
    }));
  }, [client]);

  // Queries
  const predictionMarkets = useQuery({
    queryKey: ["prediction-markets", state.marketParams],
    queryFn: fetchMarkets,
    enabled: !!client,
  });

  const poll = useQuery({
    queryKey: ["poll", state.pollAddress],
    queryFn: fetchPoll,
    enabled: !!client && !!state.pollAddress,
  });

  // Contract functions
  const createPoll = useCallback(async (params: FunctionParams["createPoll"]) => {
    if (!client || !account?.bech32Address) return;

    const msg = {
      create_poll: {
        question: params.question,
        avatar: params.avatar,
        rule: params.rule,
        description: params.description,
        duration: params.duration,
        yes_token_name: params.yesTokenName,
        yes_token_symbol: params.yesTokenSymbol,
        no_token_name: params.noTokenName,
        no_token_symbol: params.noTokenSymbol,
      },
    };

    return client.execute(
      account.bech32Address,
      CORE_CONTRACT,
      msg,
      "auto",
      "",
      [{ amount: "1000000", denom: "uxion" }]
    );
  }, [client, account]);

  const stake = useCallback(async (params: FunctionParams["stake"]) => {
    if (!client || !account?.bech32Address) return;

    const msg = {
      stake: {
        amount: params.amount,
        position: params.position,
      },
    };

    return client.execute(
      account.bech32Address,
      params.pollAddress,
      msg,
      "auto",
      "",
      [{ amount: params.amount, denom: "uxion" }]
    );
  }, [client, account]);

  const withdrawStake = useCallback(async (params: FunctionParams["withdrawStake"]) => {
    if (!client || !account?.bech32Address) return;

    const msg = {
      withdraw_stake: {},
    };

    return client.execute(
      account.bech32Address,
      params.pollAddress,
      msg,
      "auto"
    );
  }, [client, account]);

  // Helpers
  const updateParams = useCallback((updates: Partial<QueryState>) => {
    dispatch({ type: "UPDATE_PARAMS", payload: updates });
  }, []);

  return {
    predictionMarkets,
    poll,
    createPoll,
    stake,
    withdrawStake,
    updateParams,
    fetchPollActivities,
    isConnected: !!account?.bech32Address,
    address: account?.bech32Address,
  };
}; 