import { config } from "@/providers/wagmi/config";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Address, formatEther } from "viem";
import { readContract } from "wagmi/actions";

import capyStrategy from "@/types/contracts/capy-strategy";

const CAPY_STRATEGY_ABI = capyStrategy.abi;

export interface Beneficiary {
  address: string;
  name: string;
  avatar: string;
  bio: string;
  allocation: bigint;
  streamProgress: {
    percentage: number;
    remaining: bigint;
    endsAt: string;
  };
}

export interface Participant {
  address: Address;
  name: string;
  avatar: string;
  bio: string;
  allocation: bigint;
  status:
    | "None"
    | "Pending"
    | "Accepted"
    | "Rejected"
    | "Appealed"
    | "InReview"
    | "Canceled";
}
export interface Strategy {
  name: string;
  description: string;
  avatar: string;
  strategyAddress: Address;
  blockTimestamp: number;
  poolSize: bigint;
  poolId: bigint;
  registrationStartTime: bigint;
  registrationEndTime: bigint;
  allocationStartTime: bigint;
  allocationEndTime: bigint;
}

const useFundData = (strategyAddress?: Address) => {
  const strategyQuery = useQuery<Strategy>({
    queryKey: ["strategy", strategyAddress],
    queryFn: async () => {
      const [
        strategyResponse,
        poolSizeResponse,
        poolIdResponse,
        registrationStartTimeResponse,
        registrationEndTimeResponse,
        allocationStartTimeResponse,
        allocationEndTimeResponse,
      ] = await Promise.all([
        fetch("http://localhost:8000/subgraphs/name/capy-strategy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query GetStrategy($address: String!) {
                strategyCreateds(
                  where: { strategyAddress: $address }
                  first: 1
                ) {
                  name
                  description
                  avatar
                  strategyAddress
                  blockTimestamp
                }
              }
            `,
            variables: { address: strategyAddress },
          }),
        }),
        readContract(config, {
          address: strategyAddress!,
          abi: CAPY_STRATEGY_ABI,
          functionName: "getPoolAmount",
        }),
        readContract(config, {
          address: strategyAddress!,
          abi: CAPY_STRATEGY_ABI,
          functionName: "getPoolId",
        }),
        readContract(config, {
          address: strategyAddress!,
          abi: CAPY_STRATEGY_ABI,
          functionName: "registrationStartTime",
        }),
        readContract(config, {
          address: strategyAddress!,
          abi: CAPY_STRATEGY_ABI,
          functionName: "registrationEndTime",
        }),
        readContract(config, {
          address: strategyAddress!,
          abi: CAPY_STRATEGY_ABI,
          functionName: "allocationStartTime",
        }),
        readContract(config, {
          address: strategyAddress!,
          abi: CAPY_STRATEGY_ABI,
          functionName: "allocationEndTime",
        }),
      ]);

      const strategyData = await strategyResponse.json();
      const strategy = strategyData.data.strategyCreateds[0];

      return {
        ...strategy,
        poolSize: formatEther(poolSizeResponse),
        poolId: poolIdResponse,
        registrationStartTime: registrationStartTimeResponse,
        registrationEndTime: registrationEndTimeResponse,
        allocationStartTime: allocationStartTimeResponse,
        allocationEndTime: allocationEndTimeResponse,
      };
    },
    enabled: !!strategyAddress,
  });

  const beneficiariesQuery = useQuery<Beneficiary[]>({
    queryKey: ["beneficiaries", strategyAddress],
    queryFn: async () => {
      const response = await fetch(
        "http://localhost:8000/subgraphs/name/capy-strategy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
                query GetBeneficiaries($trust: String!) {
                  distributionExecuteds(where: { strategyAddress: $trust }) {
                    recipientIds
                    allocations
                    duration
                    blockTimestamp
                  }
                  recipientRegistereds {
                    recipientAddress
                    name
                    avatar
                    bio
                  }
                }
              `,
            variables: { trust: strategyAddress },
          }),
        }
      );

      const data = await response.json();
      const currentTime = Math.floor(Date.now() / 1000);

      return data.data.distributionExecuteds.map((dist: any) => {
        const recipient = data.data.recipientRegistereds.find(
          (r: any) => r.recipientAddress === dist.recipientIds[0]
        );

        const endTime = Number(dist.blockTimestamp) + Number(dist.duration);
        const totalDuration = Number(dist.duration);
        const elapsed = currentTime - Number(dist.blockTimestamp);
        const percentage = Math.min((elapsed / totalDuration) * 100, 100);

        return {
          address: dist.recipientIds[0],
          name: recipient?.name || "",
          avatar: recipient?.avatar || "",
          bio: recipient?.bio || "",
          allocation: BigInt(dist.allocations[0]),
          streamProgress: {
            percentage,
            remaining:
              (BigInt(dist.allocations[0]) * BigInt(totalDuration - elapsed)) /
              BigInt(totalDuration),
            endsAt: formatDistanceToNow(new Date(endTime * 1000), {
              addSuffix: true,
            }),
          },
        };
      });
    },
    enabled: !!strategyAddress,
  });

  const participantsQuery = useQuery<Participant[]>({
    queryKey: ["participants", strategyAddress],
    queryFn: async () => {
      const response = await fetch(
        "http://localhost:8000/subgraphs/name/capy-strategy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query GetParticipants($trust: String!) {
                recipientRegistereds(where: { strategyAddress: $trust }) {
                  recipientAddress
                  name
                  avatar
                  bio
                }
                recipientStatusUpdateds(orderBy: blockTimestamp, orderDirection: desc, where: { strategyAddress: $trust }) {
                  recipientAddress
                  status
                }
                allocationUpdateds(orderBy: blockTimestamp, orderDirection: desc, where: { strategyAddress: $trust }) {
                  recipientAddress
                  newAllocation
                }
              }
            `,
            variables: { trust: strategyAddress },
          }),
        }
      );

      const data = await response.json();

      return data.data.recipientRegistereds.map((recipient: any) => {
        const statusUpdate = data.data.recipientStatusUpdateds.find(
          (status: any) =>
            status.recipientAddress === recipient.recipientAddress
        );

        const allocationUpdate = data.data.allocationUpdateds.find(
          (allocation: any) =>
            allocation.recipientAddress === recipient.recipientAddress
        );

        const statusMap = {
          0: "None",
          1: "Pending",
          2: "Accepted",
          3: "Rejected",
          4: "Appealed",
          5: "InReview",
          6: "Canceled",
        };

        return {
          address: recipient.recipientAddress,
          name: recipient.name,
          avatar: recipient.avatar,
          bio: recipient.bio,
          status:
            statusMap[statusUpdate?.status as keyof typeof statusMap] ||
            "Pending",
          allocation: allocationUpdate
            ? BigInt(allocationUpdate.newAllocation)
            : BigInt(0),
        };
      });
    },
    enabled: !!strategyAddress,
  });

  return {
    strategy: strategyQuery.data,
    beneficiaries: beneficiariesQuery.data || [],
    participants: participantsQuery.data || [],
    isLoading:
      strategyQuery.isLoading ||
      beneficiariesQuery.isLoading ||
      participantsQuery.isLoading,
    error:
      strategyQuery.error ||
      beneficiariesQuery.error ||
      participantsQuery.error,
  };
};

export default useFundData;
