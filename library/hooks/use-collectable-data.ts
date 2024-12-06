import { useQuery } from "@tanstack/react-query";
import { formatEther } from "viem";
import { readContract } from "wagmi/actions";

import { config } from "@/providers/wagmi/config";
import allo from "@/types/contracts/allo";
import { GroupedStream } from "@/types/index";

export const useCollectableData = () => {
  const getCollectableData = (address: string) => {
    interface StreamSetup {
      token: string;
      recipient: string;
      poolId: string;
      duration: string;
      capyNftId: string;
      recipientDriverAccountId: string;
      blockTimestamp: string;
      totalAllocation: string;
      strategyAddress: string;
    }

    const streamSetupsQuery = useQuery<StreamSetup[]>({
      queryKey: ["streamSetups", address],
      queryFn: async () => {
        const response = await fetch(
          "https://api.goldsky.com/api/public/project_cm3qfn5fuevvy01tpflhe9hb0/subgraphs/capyflows-subgraph/1.0.0/gn",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: `
                query GetStreamSetups($address: String!) {
                  streamSetups(where: { recipient: $address }) {
                    token
                    recipient 
                    poolId
                    duration
                    capyNftId
                    recipientDriverAccountId
                    blockTimestamp
                    totalAllocation
                  }
                }
              `,
              variables: { address },
            }),
          }
        );

        const streamData = await response.json();
        const setups = await Promise.all(
          streamData.data.streamSetups.map(async (setup: StreamSetup) => {
            const poolId = BigInt(setup.poolId);

            const strategy = await readContract(config, {
              address: allo.address as `0x${string}`,
              abi: allo.abi,
              functionName: "getPool",
              args: [poolId],
            });

            return {
              ...setup,
              strategyAddress: strategy.strategy,
            };
          })
        );

        return setups;
      },
      enabled: !!address,
    });

    interface Strategy {
      name: string;
      description: string;
      avatar: string;
    }

    const strategyDataQuery = useQuery<Strategy[]>({
      queryKey: ["strategyData", streamSetupsQuery.data],
      queryFn: async () => {
        if (!streamSetupsQuery?.data) return [];

        const strategies = await Promise.all(
          streamSetupsQuery.data.map(async (setup: StreamSetup) => {
            const response = await fetch(
              "https://api.goldsky.com/api/public/project_cm3qfn5fuevvy01tpflhe9hb0/subgraphs/capyflows-subgraph/1.0.0/gn",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  query: `
                    query GetStrategy($address: String!) {
                      strategyCreateds(
                        where: { strategyAddress: $address }
                      ) {
                        name
                        description
                        avatar
                      }
                    }
                  `,
                  variables: { address: setup.strategyAddress },
                }),
              }
            );

            const strategyData = await response.json();
            return strategyData.data.strategyCreateds[0];
          })
        );

        return strategies;
      },
      enabled: !!streamSetupsQuery.data,
    });

    const groupedStreams = streamSetupsQuery.data?.map(
      (stream, index): GroupedStream => {
        const strategy = strategyDataQuery.data?.[index];
        return {
          poolId: streamSetupsQuery.data!![index].poolId,
          strategyAddress: stream.strategyAddress || "",
          avatar: strategy?.avatar || "",
          name: strategy?.name || "",
          description: strategy?.description || "",
          token: stream.token,
          recipient: stream.recipient,
          duration: Number(stream.duration),
          capyNftId: stream.capyNftId,
          recipientDriverAccountId: stream.recipientDriverAccountId,
          createdAt: Number(stream.blockTimestamp) * 1000,
          totalAllocation: formatEther(BigInt(stream.totalAllocation)),
        };
      }
    );

    return {
      data: groupedStreams || [],
      isLoading: streamSetupsQuery.isLoading || strategyDataQuery.isLoading,
      error: streamSetupsQuery.error || strategyDataQuery.error,
    };
  };

  return {
    getCollectableData,
  };
};
