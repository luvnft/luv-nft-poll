import { useQuery } from "@tanstack/react-query";
import { useAbstraxionSigningClient, useAbstraxionClient, useAbstraxionAccount } from "@burnt-labs/abstraxion";
//import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { useCallback } from "react";

// Contract addresses (replace with actual addresses)
const CAPY_CORE_ADDRESS = "your_capy_core_address";
const USDE_TOKEN_ADDRESS = "your_usde_token_address";

export interface PredictionMarket {
  pollAddress: string;
  avatar: string;
  question: string;
  status: "active" | "resolved";
  poolSize: number;
  participants: number;
  endDate: number;
  tags: string[];
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

export interface CreatePollParams {
  question: string;
  avatar: string;
  description: string;
  duration: number;
  yesTokenName: string;
  yesTokenSymbol: string;
  noTokenName: string;
  noTokenSymbol: string;
}

export interface StakeParams {
  pollAddress: string;
  amount: number;
  position: boolean; // true for YES, false for NO
}

export const useXionProtocol = () => {
  const { client } = useAbstraxionSigningClient();
  const { data: account } = useAbstraxionAccount();

  // Query all prediction markets
  const predictionMarkets = useQuery({
    queryKey: ["prediction-markets"],
    queryFn: async () => {
      if (!client) return [];

      // Query poll count
      const { count } = await client.queryContractSmart(CAPY_CORE_ADDRESS, {
        get_poll_count: {},
      });

      // Get all polls
      const markets: PredictionMarket[] = [];
      for (let i = 0; i < count; i++) {
        const { address } = await client.queryContractSmart(CAPY_CORE_ADDRESS, {
          get_poll_at: { index: i },
        });

        // Get poll details
        const pollInfo = await client.queryContractSmart(address, {
          get_poll_info: {},
        });

        // Get poll details from core contract
        const { exists, description } = await client.queryContractSmart(
          CAPY_CORE_ADDRESS,
          {
            get_poll_details: { poll_address: address },
          }
        );

        if (exists) {
          markets.push({
            pollAddress: address,
            avatar: "", // TODO: Store avatar in contract
            question: description,
            status: pollInfo.is_resolved ? "resolved" : "active",
            poolSize: Number(pollInfo.total_staked) / 1e18,
            participants: 0, // TODO: Track participants
            endDate: pollInfo.end_timestamp * 1000,
            tags: [],
            recentActivity: [], // TODO: Implement activity tracking
          });
        }
      }

      return markets;
    },
    enabled: !!client,
  });

  // Create a new poll
  const createPoll = useCallback(
    async (params: CreatePollParams) => {
      if (!client || !account?.bech32Address) {
        throw new Error("Client or account not available");
      }

      // First approve USDE token
      await client.execute(
        account.bech32Address,
        USDE_TOKEN_ADDRESS,
        {
          increase_allowance: {
            spender: CAPY_CORE_ADDRESS,
            amount: "2000000000000000000", // 2 USDE
          },
        },
        "auto"
      );

      // Create poll
      const result = await client.execute(
        account.bech32Address,
        CAPY_CORE_ADDRESS,
        {
          create_poll: {
            question: params.question,
            avatar: params.avatar,
            description: params.description,
            duration: params.duration,
            yes_token_name: params.yesTokenName,
            yes_token_symbol: params.yesTokenSymbol,
            no_token_name: params.noTokenName,
            no_token_symbol: params.noTokenSymbol,
          },
        },
        "auto"
      );

      return result;
    },
    [client, account]
  );

  // Stake in a poll
  const stake = useCallback(
    async (params: StakeParams) => {
      if (!client || !account?.bech32Address) {
        throw new Error("Client or account not available");
      }

      // First approve USDE token
      await client.execute(
        account.bech32Address,
        USDE_TOKEN_ADDRESS,
        {
          increase_allowance: {
            spender: params.pollAddress,
            amount: params.amount.toString(),
          },
        },
        "auto"
      );

      // Stake in poll
      const result = await client.execute(
        account.bech32Address,
        params.pollAddress,
        {
          stake: {
            amount: params.amount.toString(),
            position: params.position,
          },
        },
        "auto"
      );

      return result;
    },
    [client, account]
  );

  // Resolve a poll
  const resolvePoll = useCallback(
    async (pollAddress: string, winningPosition: boolean) => {
      if (!client || !account?.bech32Address) {
        throw new Error("Client or account not available");
      }

      const result = await client.execute(
        account.bech32Address,
        pollAddress,
        {
          resolve_poll: {
            winning_position: winningPosition,
          },
        },
        "auto"
      );

      return result;
    },
    [client, account]
  );

  // Withdraw stake from a poll
  const withdrawStake = useCallback(
    async (pollAddress: string) => {
      if (!client || !account?.bech32Address) {
        throw new Error("Client or account not available");
      }

      const result = await client.execute(
        account.bech32Address,
        pollAddress,
        {
          withdraw_stake: {},
        },
        "auto"
      );

      return result;
    },
    [client, account]
  );

  return {
    predictionMarkets,
    createPoll,
    stake,
    resolvePoll,
    withdrawStake,
  };
}; 