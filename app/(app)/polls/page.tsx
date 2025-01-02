"use client";

import { Loader } from "lucide-react";
import { useAccount } from "wagmi";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/tabs";
import ActiveFunds from "@/components/molecules/active-funds";
import FundLink from "@/components/molecules/fund-links";
import RecentActions from "@/components/molecules/recent-actions";
import TrustStats from "@/components/molecules/trust-stats";
import NewTrustFund from "@/components/organisms/new-trust-fund";
import { useMounted } from "@/hooks/use-mounted";
import useTrustData from "@/hooks/use-trust-data";
import useStore from "@/store";

interface RecentAction {
  action: string;
  date: string;
}

const TrustPage = () => {
  const { profile } = useStore();
  const isMounted = useMounted();
  const { address } = useAccount();
  const { activeFunds, dashboardStats, isLoading, error } =
    useTrustData(address);

  const recentActions: RecentAction[] = [
    { action: "Uploaded a new file", date: "2024-12-01" },
    { action: "Edited profile settings", date: "2024-11-30" },
    { action: "Commented on a post", date: "2024-11-29" },
    { action: "Joined a new project", date: "2024-11-28" },
    { action: "Completed a task", date: "2024-11-27" },
  ];

  if (!isMounted) return null;
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader className="animate-spin text-gray-500 mt-36 mb-4" size={24} />
        <p className="text-gray-700">Loading trust...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        {error.message}
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Polls Dashboard</h2>

      <Tabs defaultValue="overview" className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="polls">Polls</TabsTrigger>
            <TabsTrigger value="notifications" disabled>
              Notifications
            </TabsTrigger>
            <TabsTrigger value="settings" disabled>
              Settings
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            <NewTrustFund />
          </div>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Overview</h2>
          <TrustStats
            totalDistributed={dashboardStats?.totalDistributed ?? "0"}
            ongoingStreams={dashboardStats?.ongoingStreams ?? 0}
            activeBeneficiaries={dashboardStats?.activeBeneficiaries ?? 0}
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <ActiveFunds data={activeFunds} />
            <RecentActions actions={recentActions} />
          </div>
        </TabsContent>

        <TabsContent value="polls" className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">All Polls</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {activeFunds.map((fund) => (
              <FundLink
                key={fund.strategyAddress}
                strategyAddress={fund.strategyAddress}
                name={fund.name}
                description={fund.description}
                avatarUrl={fund.avatar}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrustPage;
