"use client";

import * as React from "react";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";
import {
  Address,
  encodeAbiParameters,
  parseAbiParameters,
  parseEther,
} from "viem";
import { formatDistanceToNow, format } from "date-fns";
import { Lock } from "lucide-react";
import { toast } from "sonner";

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
import { ellipsisAddress, getInitials, isValidUrl } from "@/utils";
import ParticipantProfile, {
  Participant,
} from "@/components/organisms/participant-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { defineStepper } from "@stepperize/react";
import { Button } from "@/components/atoms/button";
import useCapyProtocol from "@/hooks/use-capy-protocol";

const { useStepper } = defineStepper(
  {
    id: "registration",
    title: "Registration",
    description: "Register participants",
  },
  {
    id: "allocation",
    title: "Allocation",
    description: "Allocate resources",
  },
  {
    id: "distribution",
    title: "Distribution",
    description: "Distribute funds",
  }
);

const Fund = () => {
  const params = useParams();
  const fund = params.fund as Address;
  const isMounted = useMounted();
  const stepper = useStepper();
  const isAdmin = true;
  const { updateRecipientStatus, allocate, distribute } = useCapyProtocol();

  const { beneficiaries, strategy, participants, isLoading, error } =
    useFundData(fund);

  // State for tracking changes in participant statuses and allocations
  const [participantChanges, setParticipantChanges] = React.useState<{
    [address: string]: {
      status?: Participant["status"];
      allocation?: string;
    };
  }>({});

  const [isSaving, setIsSaving] = React.useState(false);
  const [isDistributing, setIsDistributing] = React.useState(false);

  const currentTime = BigInt(Math.floor(Date.now() / 1000));
  const isRegistrationOpen =
    strategy?.registrationStartTime &&
    strategy?.registrationEndTime &&
    currentTime >= strategy.registrationStartTime &&
    currentTime <= strategy.registrationEndTime;

  const isAllocationOpen =
    strategy?.allocationStartTime &&
    strategy?.allocationEndTime &&
    currentTime >= strategy.allocationStartTime &&
    currentTime <= strategy.allocationEndTime;

  const isDistributionOpen =
    strategy?.allocationEndTime && currentTime > strategy.allocationEndTime;

  const getFilteredParticipants = (step: string) => {
    switch (step) {
      case "registration":
        return participants;
      case "allocation":
        return participants.filter((p) => p.status === "Accepted");
      case "distribution":
        return participants.filter(
          (p) => parseInt(p.allocation) > 0 && p.status === "Accepted"
        );
      default:
        return participants;
    }
  };

  // Check if there are any unsaved changes
  const hasChanges = Object.keys(participantChanges).length > 0;

  // Handle status change for a participant
  const handleStatusChange = (
    address: Address,
    status: Participant["status"]
  ) => {
    setParticipantChanges((prev) => ({
      ...prev,
      [address]: { ...prev[address], status },
    }));
  };

  // Handle allocation change for a participant
  const handleAllocationChange = (address: Address, allocation: string) => {
    setParticipantChanges((prev) => ({
      ...prev,
      [address]: { ...prev[address], allocation },
    }));
  };

  // Save all changes based on current step
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const statusMap = {
        None: 0,
        Pending: 1,
        Accepted: 2,
        Rejected: 3,
        Appealed: 4,
        InReview: 5,
        Canceled: 6,
      };

      if (stepper.current.id === "registration") {
        const statusChanges = Object.entries(participantChanges)
          .filter(([_, changes]) => changes.status)
          .map(([address, changes]) => ({
            status: statusMap[changes.status!], // Add ! since we filtered for status existing
            strategyAddress: strategy?.strategyAddress!,
            recipientId: address as Address,
          }));

        // Process status changes sequentially
        for (const change of statusChanges) {
          await updateRecipientStatus(change);
        }
      } else if (stepper.current.id === "allocation") {
        // Get addresses and allocations from participant changes
        const allocationChanges = Object.entries(participantChanges)
          .filter(
            ([_, changes]) => changes.allocation && changes.allocation !== "0"
          )
          .reduce(
            (acc, [address, changes]) => {
              acc.addresses.push(address as Address);
              acc.amounts.push(parseEther(changes.allocation!));
              return acc;
            },
            { addresses: [] as Address[], amounts: [] as bigint[] }
          );

        // Encode parameters for allocation
        const data = encodeAbiParameters(
          parseAbiParameters("address[], uint256[]"),
          [allocationChanges.addresses, allocationChanges.amounts]
        );

        strategy?.poolId &&
          (await allocate({ poolId: strategy?.poolId, data }));
      }

      // Clear changes after successful save
      setParticipantChanges({});
      toast.success("Changes saved successfully");
    } catch (error) {
      console.error("Failed to save changes:", error);
      toast.error(
        `Failed to save: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const distributionParticipants = getFilteredParticipants("distribution").map(
    (participant) => participant.address as Address
  );
  const handleDistribution = async () => {
    const data = encodeAbiParameters(
      parseAbiParameters("uint32"),
      [180] // 3 minutes in seconds
    );
    await distribute({
      poolId: strategy?.poolId!,
      recipientIds: distributionParticipants,
      data,
    });
  };

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
        {error?.message}
      </div>
    );
  }
  if (!strategy?.strategyAddress) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 mt-32">
        Trust fund does not exist yet
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex gap-2">
        <Avatar>
          <AvatarImage
            src={
              isValidUrl(strategy?.avatar ?? "")
                ? strategy?.avatar
                : `https://avatar.vercel.sh/${
                    (strategy?.strategyAddress ?? "") + (strategy?.name ?? "")
                  }`
            }
            alt={`${strategy?.name ?? "Trust Fund"} logo`}
          />
          <AvatarFallback>{getInitials(strategy?.name ?? "")}</AvatarFallback>
        </Avatar>
        <h2 className="text-3xl font-bold tracking-tight">
          {strategy?.name || `Trust ${ellipsisAddress(fund)}`}
        </h2>
      </div>

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
            {!isRegistrationOpen && strategy?.registrationEndTime && (
              <p className="text-sm text-gray-500 mt-2">
                Registration closed{" "}
                {formatDistanceToNow(
                  new Date(Number(strategy.registrationEndTime) * 1000),
                  { addSuffix: true }
                )}{" "}
                (ended{" "}
                {format(
                  new Date(Number(strategy.registrationEndTime) * 1000),
                  "PPp"
                )}
                )
              </p>
            )}
            {isRegistrationOpen &&
              strategy?.registrationStartTime &&
              strategy?.registrationEndTime && (
                <p className="text-sm text-gray-500 mt-2">
                  Registration open:{" "}
                  {formatDistanceToNow(
                    new Date(Number(strategy.registrationEndTime) * 1000),
                    { addSuffix: true }
                  )}{" "}
                  remaining (from{" "}
                  {format(
                    new Date(Number(strategy.registrationStartTime) * 1000),
                    "PPp"
                  )}{" "}
                  to{" "}
                  {format(
                    new Date(Number(strategy.registrationEndTime) * 1000),
                    "PPp"
                  )}
                  )
                </p>
              )}
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
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Participants</h2>
            {hasChanges && (
              <Button onClick={handleSaveChanges} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            )}
            {stepper.current.id === "distribution" && (
              <Button
                onClick={handleDistribution}
                disabled={
                  isDistributing || distributionParticipants.length === 0
                }
              >
                {isDistributing
                  ? "Distributing..."
                  : "Distribute (streams for 3 minutes)"}
              </Button>
            )}
          </div>

          {isAdmin && (
            <nav aria-label="Fund Steps" className="group my-4">
              <ol
                className="flex items-center justify-between gap-2"
                aria-orientation="horizontal"
              >
                {stepper.all.map((step, index, array) => {
                  const isLocked =
                    (step.id === "allocation" &&
                      currentTime <
                        (strategy?.allocationStartTime ?? BigInt(0))) ||
                    (step.id === "distribution" &&
                      currentTime <=
                        (strategy?.allocationEndTime ?? BigInt(0)));

                  return (
                    <React.Fragment key={step.id}>
                      <li className="flex items-center gap-4 flex-shrink-0">
                        <button
                          type="button"
                          disabled={isLocked}
                          className={`relative flex size-10 items-center justify-center rounded-full ${
                            isLocked
                              ? "bg-gray-200 cursor-not-allowed"
                              : index <= stepper.current.index
                              ? "bg-primary text-white"
                              : "bg-secondary"
                          }`}
                          aria-current={
                            stepper.current.id === step.id ? "step" : undefined
                          }
                          onClick={() => !isLocked && stepper.goTo(step.id)}
                        >
                          {isLocked ? <Lock className="w-4 h-4" /> : index + 1}
                        </button>
                        <span className="text-sm font-medium">
                          {step.title}
                        </span>
                      </li>
                      {index < array.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 ${
                            index < stepper.current.index
                              ? "bg-primary"
                              : "bg-muted"
                          }`}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </ol>
            </nav>
          )}

          <div className="col-span-5 grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {getFilteredParticipants(stepper.current.id).length > 0 ? (
              getFilteredParticipants(stepper.current.id).map((participant) => (
                <ParticipantProfile
                  key={participant.address}
                  data={{
                    ...participant,
                    strategyAddress: strategy?.strategyAddress!,
                  }}
                  isAdmin={isAdmin}
                  step={isAdmin ? stepper.current.id : undefined}
                  onStatusChange={handleStatusChange}
                  onAllocationChange={handleAllocationChange}
                  status={participantChanges[participant.address]?.status}
                  allocation={
                    participantChanges[participant.address]?.allocation
                  }
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
