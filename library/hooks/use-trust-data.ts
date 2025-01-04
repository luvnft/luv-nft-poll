import { useQuery } from "@tanstack/react-query";
import { Address, formatEther } from "viem";

export interface TrustFund {
  name: string;
  description: string;
  avatar: string;
  strategyAddress: string;
}

export interface DashboardStats {
  totalDistributed: string;
  ongoingStreams: number;
  activeBeneficiaries: number;
}

const useTrustData = (userAddress?: Address) => {
  const activeFundsQuery = useQuery({
    queryKey: ["activeFunds", userAddress],
    queryFn: async () => {
      const response = await fetch(
        "https://api.goldsky.com/api/public/project_cm3qfn5fuevvy01tpflhe9hb0/subgraphs/capypolls-subgraph/1.0.2/gn",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
            query GetActiveFunds($owner: String!) { # $limit: Int!
              strategyCreateds(
                where: { owner: $owner }
                orderBy: blockTimestamp
                orderDirection: desc
                first: $limit
              ) {
                name
                description
                avatar
                strategyAddress
              }
            }
          `,
            variables: { owner: userAddress, limit: 5 },
          }),
        }
      );

      const data = await response.json();
      return data.data.strategyCreateds as TrustFund[];
    },
    enabled: !!userAddress,
  });

  const dashboardStatsQuery = useQuery({
    queryKey: ["dashboardStats", userAddress],
    queryFn: async () => {
      const response = await fetch(
        "https://api.goldsky.com/api/public/project_cm3qfn5fuevvy01tpflhe9hb0/subgraphs/capyflows-subgraph/1.0.2/gn",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
            query GetDashboardStats($owner: String!) {
              distributionExecuteds(where: { owner: $owner }) {
                allocations
                recipientIds
                duration
                blockTimestamp
              }
            }
          `,
            variables: { owner: userAddress },
          }),
        }
      );

      const data = await response.json();
      const distributions = data.data.distributionExecuteds;
      const currentTime = Math.floor(Date.now() / 1000);

      let totalDistributed = BigInt(0);
      let ongoingStreams = 0;
      const activeBeneficiariesSet = new Set<string>();

      distributions.forEach((dist: any) => {
        // Calculate total distributed
        const distributionTotal = dist.allocations.reduce(
          (acc: bigint, curr: string) => acc + BigInt(curr),
          BigInt(0)
        );
        totalDistributed += distributionTotal;

        // Check if stream is active
        const endTime = Number(dist.blockTimestamp) + Number(dist.duration);
        if (endTime > currentTime) {
          ongoingStreams++;
          dist.recipientIds.forEach((id: string) =>
            activeBeneficiariesSet.add(id)
          );
        }
      });

      return {
        totalDistributed: formatEther(BigInt(totalDistributed)),
        ongoingStreams: ongoingStreams,
        activeBeneficiaries: activeBeneficiariesSet.size,
      } as DashboardStats;
    },
    enabled: !!userAddress,
  });

  return {
    activeFunds: activeFundsQuery.data || [],
    dashboardStats: dashboardStatsQuery.data,
    isLoading: activeFundsQuery.isLoading || dashboardStatsQuery.isLoading,
    error: activeFundsQuery.error || dashboardStatsQuery.error,
  };
};

export default useTrustData;
