"use client";

import { Loader } from "lucide-react";
import { useParams } from "next/navigation";
import { Address } from "viem";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/tabs";
import FundStats from "@/components/molecules/fund-stats";
import Beneficiary from "@/components/organisms/beneficiary-profile";
import NewTrustFundApplication from "@/components/organisms/trust-fund-application";
import useFundData from "@/hooks/use-fund-data";
import { useMounted } from "@/hooks/use-mounted";
import { ellipsisAddress } from "@/utils";
import ParticipantProfile from "@/components/organisms/participant-profile";

const Fund = () => {
  const params = useParams();
  const fund = params.fund as Address;
  const isMounted = useMounted();

  const { beneficiaries, strategy, participants, isLoading, error } =
    useFundData(fund);

  if (!isMounted) return null;
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader className="animate-spin text-gray-500 mt-36 mb-4" size={24} />
        <p className="text-gray-700">Loading funds...</p>
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
      <h2 className="text-3xl font-bold tracking-tight">
        {strategy?.name || `Trust ${ellipsisAddress(fund)}`}
      </h2>

      <Tabs defaultValue="overview" className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="notifications" disabled>
              Notifications
            </TabsTrigger>
            <TabsTrigger value="settings" disabled>
              Settings
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            {strategy?.poolId && (
              <NewTrustFundApplication poolId={strategy?.poolId} />
            )}
          </div>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Overview</h2>
            {strategy?.description || <p>This is trust fund {fund}.</p>}
          </div>

          <FundStats data={strategy} />

          <h3 className="text-lg font-bold tracking-tight">Beneficiaries</h3>

          <div className="col-span-5 grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {beneficiaries.length > 0 ? (
              beneficiaries.map((beneficiary) => (
                <Beneficiary key={beneficiary.address} data={beneficiary} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No beneficiaries found
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="participants" className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Participants</h2>
          <div className="col-span-5 grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {participants.length > 0 ? (
              participants.map((participant) => (
                <ParticipantProfile
                  key={participant.address}
                  data={{...participant, strategyAddress: strategy?.strategyAddress!}}
                  isAdmin
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No participants found
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Fund;
