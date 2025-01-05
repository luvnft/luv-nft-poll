import { useQuery } from "@tanstack/react-query";
import {
  readContract,
  simulateContract,
  waitForTransactionReceipt,
  writeContract,
} from "@wagmi/core";
import { format } from "date-fns";
import ky from "ky";
import { useCallback, useReducer } from "react";
import { Hash, erc20Abi, formatEther, parseUnits } from "viem";

import { config } from "@/providers/wagmi/config";
import capyCore from "@/types/contracts/capy-core";
import capyPoll from "@/types/contracts/capy-poll";

const CAPY_POLL_ABI = capyPoll.abi;
const CAPY_CORE_ABI = capyCore.abi;
const USDE_TOKEN_ADDRESS = "0x9E1eF5A92C9Bf97460Cd00C0105979153EA45b27";
const CAPY_CORE_ADDRESS = capyCore.address;

const SUBGRAPH_URL =
  "https://api.goldsky.com/api/public/project_cm5jmcfrvjkpm01x8hfx55o9q/subgraphs/capypolls-subgraph/1.0.0/gn";

type FunctionParams = {
  createPoll: {
    question: string;
    avatar: string;
    rule: string;
    duration: bigint;
    yesTokenName: string;
    yesTokenSymbol: string;
    noTokenName: string;
    noTokenSymbol: string;
  };
  stake: {
    pollAddress: Hash;
    amount: number;
    position: boolean; // true for YES, false for NO
  };
  withdrawFunds: {
    pollAddress: Hash;
  };
  getPollDetails: {
    pollAddress: Hash;
  };
  approve: {
    token: Hash;
    spender: Hash;
    amount: bigint;
  };
};

interface PredictionMarket {
  pollAddress: Hash;
  avatar: string;
  question: string;
  status: "active" | "resolved";
  poolSize: number;
  participants: number;
  endDate: number;
  tags: never[];
  recentActivity: {
    id: string;
    user: string;
    action: string;
    choice: string;
    amount: number;
    timestamp: number;
    avatar: string;
    question: string;
  }[];
}

interface Activity {
  id: string;
  type: string;
}

interface Poll {
  id: string;
  question: string;
  blockTimestamp: string;
  creator: string;
  pollAddress: Hash;
  avatar: string;
  description: string;
  yesToken: string;
  noToken: string;
  status: "active" | "resolved";
  startDate: number;
  endDate: number;
  poolSize: number;
  winner: "Yes" | "No";
  radialData: Array<{
    type: string;
    yes: number;
    no: number;
  }>;
  timeSeriesData: Array<{
    date: string;
    yes: number;
    no: number;
  }>;
  recentActivity: {
    id: string;
    user: string;
    action: string;
    choice: string;
    amount: number;
    timestamp: number;
    avatar: string;
  }[];
}

interface QueryState {
  marketParams: any;
  activityParams: any;
  pollAddress: string | null;
  pollActivityParams: any;
}

type QueryAction = {
  type: "UPDATE_PARAMS";
  payload: Partial<QueryState>;
};

interface PollCreatedResponse {
  data: {
    pollCreateds: Array<{
      pollAddress: Hash;
      avatar: string;
      question: string;
    }>;
  };
}

interface PollResolvedResponse {
  data: {
    pollResolveds: Array<{
      pollAddress: Hash;
    }>;
  };
}

interface SinglePollResponse {
  data: {
    pollCreateds: Poll[];
  };
}

interface StakeAddedResponse {
  data: {
    stakeAddeds: Array<{
      id: string;
      amount: string;
      position: boolean;
      user: string;
      pollAddress: string;
      blockTimestamp: string;
    }>;
  };
}

const initialState: QueryState = {
  marketParams: {},
  activityParams: {},
  pollAddress: null,
  pollActivityParams: {},
};

const queryReducer = (state: QueryState, action: QueryAction): QueryState => {
  switch (action.type) {
    case "UPDATE_PARAMS":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const useCapyProtocol = () => {
  const [state, dispatch] = useReducer(queryReducer, initialState);

  // Query fetcher functions
  const fetchMarkets = useCallback(async () => {
    // Get created polls and stakes in one query
    const response = await ky
      .post(SUBGRAPH_URL, {
        json: {
          query: `{
            pollCreateds {
              pollAddress
              avatar
              question
            }
            stakeAddeds {
              id
              amount
              position
              user
              blockTimestamp
              pollAddress
            }
          }`,
        },
      })
      .json<{
        data: {
          pollCreateds: PollCreatedResponse["data"]["pollCreateds"];
          stakeAddeds: StakeAddedResponse["data"]["stakeAddeds"];
        };
      }>();

    const polls = response.data.pollCreateds;
    const allStakes = response.data.stakeAddeds;

    // Transform data with additional fields
    const marketsWithDetails = await Promise.all(
      polls.map(async (poll) => {
        // Get pool size
        const poolInfo = await readContract(config, {
          address: poll.pollAddress,
          abi: CAPY_POLL_ABI,
          functionName: "pollInfo",
          args: [],
        });

        // Check if poll is resolved
        const resolvedResponse = await ky
          .post(SUBGRAPH_URL, {
            json: {
              query: `{
                pollResolveds(where: { pollAddress: "${poll.pollAddress}" }) {
                  pollAddress
                }
              }`,
            },
          })
          .json<PollResolvedResponse>();

        const isResolved = resolvedResponse.data.pollResolveds.length > 0;

        // Get recent activity for this poll
        const pollStakes = allStakes
          .filter((stake) => stake.pollAddress === poll.pollAddress)
          .map((stake) => ({
            id: stake.id,
            user: stake.user,
            action: "staked",
            choice: stake.position ? "Yes" : "No",
            amount: Number(formatEther(BigInt(stake.amount))),
            timestamp: Number(stake.blockTimestamp) * 1000,
            avatar: poll.avatar,
            question: poll.question,
          }))
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 3);

        return {
          ...poll,
          status: isResolved ? "resolved" : "active",
          poolSize: Number(formatEther(poolInfo[3])),
          endDate: Number(poolInfo[0]) * 1000,
          tags: [], // TODO: use ML to suggest tags
          recentActivity: pollStakes,
        } as PredictionMarket;
      })
    );

    return marketsWithDetails;
  }, []);

  const fetchPoll = useCallback(async () => {
    if (!state.pollAddress) throw new Error("Poll ID required");

    // Get poll data and stakes in one query
    const response = await ky
      .post(SUBGRAPH_URL, {
        json: {
          query: `{
            pollCreateds(where: { pollAddress: "${state.pollAddress}" }) {
              blockTimestamp
              creator
              pollAddress
              avatar
              question
              description
              yesToken
              noToken
            }
            stakeAddeds(where: { pollAddress: "${state.pollAddress}" }) {
              id
              amount
              position
              user
              blockTimestamp
            }
          }`,
        },
      })
      .json<{
        data: {
          pollCreateds: SinglePollResponse["data"]["pollCreateds"];
          stakeAddeds: StakeAddedResponse["data"]["stakeAddeds"];
        };
      }>();

    const poll = response.data.pollCreateds[0];
    const stakes = response.data.stakeAddeds;

    // Get poll info for end date
    const poolInfo = await readContract(config, {
      address: poll.pollAddress,
      abi: CAPY_POLL_ABI,
      functionName: "pollInfo",
      args: [],
    });

    // Check if poll is resolved
    const resolvedResponse = await ky
      .post(SUBGRAPH_URL, {
        json: {
          query: `{
            pollResolveds(where: { pollAddress: "${poll.pollAddress}" }) {
              pollAddress
            }
          }`,
        },
      })
      .json<PollResolvedResponse>();

    // Calculate total yes/no amounts for radial chart
    let totalYes = 0;
    let totalNo = 0;
    stakes.forEach((stake) => {
      const amount = Number(formatEther(BigInt(stake.amount)));
      if (stake.position) {
        totalYes += amount;
      } else {
        totalNo += amount;
      }
    });

    // Create time series data
    const timeSeriesMap = new Map<string, { yes: number; no: number }>();
    stakes.forEach((stake) => {
      const date = format(
        new Date(Number(stake.blockTimestamp) * 1000),
        "yyyy-MM-dd"
      );
      const amount = Number(formatEther(BigInt(stake.amount)));

      const existing = timeSeriesMap.get(date) || { yes: 0, no: 0 };
      if (stake.position) {
        existing.yes += amount;
      } else {
        existing.no += amount;
      }
      timeSeriesMap.set(date, existing);
    });

    const timeSeriesData = [
      { date: format(new Date(), "yyyy-MM-dd"), yes: 0, no: 0 },
      ...Array.from(timeSeriesMap.entries()).map(([date, data]) => ({
        date,
        yes: data.yes,
        no: data.no,
      })),
    ];

    const isResolved = resolvedResponse.data.pollResolveds.length > 0;

    // Get recent activity
    const recentActivity = stakes
      .map((stake) => ({
        id: stake.id,
        user: stake.user,
        action: "staked",
        choice: stake.position ? "Yes" : "No",
        amount: Number(formatEther(BigInt(stake.amount))),
        timestamp: Number(stake.blockTimestamp) * 1000,
        avatar: poll.avatar,
      }))
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 3);

    return {
      ...poll,
      winner: Number(poolInfo[5]) ? "Yes" : "No",
      poolSize: Number(formatEther(poolInfo[3])),
      status: isResolved ? "resolved" : "active",
      startDate: Number(poll.blockTimestamp) * 1000,
      endDate: Number(poolInfo[0]) * 1000,
      radialData: [{ type: "vote", yes: totalYes, no: totalNo }],
      timeSeriesData: timeSeriesData.sort((a, b) =>
        a.date.localeCompare(b.date)
      ),
      recentActivity,
    };
  }, [state.pollAddress]);

  // Queries
  const predictionMarkets = useQuery({
    queryKey: ["prediction-markets", state.marketParams],
    queryFn: fetchMarkets,
  });

  const poll = useQuery({
    queryKey: ["poll", state.pollAddress],
    queryFn: fetchPoll,
    enabled: !!state.pollAddress,
  });

  // Contract functions
  const approve = useCallback(async (params: FunctionParams["approve"]) => {
    try {
      const { request } = await simulateContract(config, {
        abi: erc20Abi,
        address: params.token,
        functionName: "approve",
        args: [params.spender, params.amount],
      });

      const hash = await writeContract(config, request);

      return waitForTransactionReceipt(config, {
        hash,
      });
    } catch (error) {
      console.error("Error approving token:", error);
      throw error;
    }
  }, []);

  const createPoll = async (params: FunctionParams["createPoll"]) => {
    try {
      //  TODO: check contract for initial fee
      const formattedAmount = parseUnits("2", 18);
      await approve({
        token: USDE_TOKEN_ADDRESS,
        spender: CAPY_CORE_ADDRESS,
        amount: formattedAmount,
      });

      const { request } = await simulateContract(config, {
        abi: CAPY_CORE_ABI,
        address: CAPY_CORE_ADDRESS,
        functionName: "createPoll",
        args: [
          params.question,
          params.avatar,
          params.rule,
          params.duration,
          params.yesTokenName,
          params.yesTokenSymbol,
          params.noTokenName,
          params.noTokenSymbol,
        ],
      });

      const hash = await writeContract(config, request);
      return waitForTransactionReceipt(config, {
        hash,
      });
    } catch (error) {
      console.error("Error creating poll:", error);
      throw error;
    }
  };

  const stake = async (params: FunctionParams["stake"]) => {
    try {
      const formattedAmount = parseUnits(params.amount.toString(), 18);

      await approve({
        token: USDE_TOKEN_ADDRESS,
        spender: params.pollAddress,
        amount: formattedAmount,
      });

      const { request } = await simulateContract(config, {
        abi: CAPY_POLL_ABI,
        address: params.pollAddress,
        functionName: "stake",
        args: [formattedAmount, params.position],
      });

      return writeContract(config, request);
    } catch (error) {
      console.error("Error staking:", error);
      throw error;
    }
  };

  const withdrawFunds = useCallback(
    async (params: FunctionParams["withdrawFunds"]) => {
      try {
        const { request } = await simulateContract(config, {
          abi: CAPY_POLL_ABI,
          address: params.pollAddress,
          functionName: "withdrawStake",
          args: [],
        });
        const hash = await writeContract(config, request);

        return waitForTransactionReceipt(config, {
          hash,
        });
      } catch (error) {
        console.error("Error withdrawing funds:", error);
        throw error;
      }
    },
    []
  );

  const updateParams = useCallback((updates: Partial<QueryState>) => {
    dispatch({ type: "UPDATE_PARAMS", payload: updates });
  }, []);

  return {
    predictionMarkets,
    poll,

    createPoll,
    stake,
    withdrawFunds,

    updateParams,
  };
};

export default useCapyProtocol;
