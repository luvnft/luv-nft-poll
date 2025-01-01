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
import { Separator } from "@/components/atoms/separator";
import { YesNoChart } from "@/components/organisms/yes-no-chart";
import { Input } from "@/components/atoms/input";
import { RadialChart } from "@/components/organisms/radial-chart";

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

const recentActivity = [
  {
    id: "1",
    user: "Marcelo",
    action: "staked",
    choice: "Yes",
    amount: 77.11,
    timestamp: new Date(),
    teamLogo: "https://picsum.photos/200/200?random=101",
  },
  {
    id: "2",
    user: "hYlQDLDfDXFuWhNT",
    action: "staked",
    choice: "No",
    amount: 48.79,
    timestamp: new Date(),
    teamLogo: "https://picsum.photos/200/200?random=200",
  },
  {
    id: "3",
    user: "AidanAdelynn",
    action: "staked",
    choice: "No",
    amount: 20.0,
    timestamp: new Date(),
    teamLogo: "https://picsum.photos/200/200?random=300",
  },
];

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
    <div className="flex-1 space-y-4  p-6">
      <div className=" flex md:gap-6 flex-col md:flex-row">
        <div className=" flex flex-col md:w-2/5 gap-6">
          <div className="flex gap-2">
            <Avatar>
              <AvatarImage
                src={
                  isValidUrl(strategy?.avatar ?? "")
                    ? strategy?.avatar
                    : `https://avatar.vercel.sh/${
                        (strategy?.strategyAddress ?? "") +
                        (strategy?.name ?? "")
                      }`
                }
                alt={`${strategy?.name ?? "Trust Fund"} logo`}
              />
              <AvatarFallback>
                {getInitials(strategy?.name ?? "")}
              </AvatarFallback>
            </Avatar>
            {/* <h2 className="text-3xl font-bold tracking-tight">
              {strategy?.name || `Trust ${ellipsisAddress(fund)}`}
            </h2> */}
            <h2 className="text-3xl font-bold tracking-tight">
            Will Ethena will become the top DeFi protocol by TVL in Q1 2025?            </h2>
          </div>
          <div className=" ">
            {/* {strategy?.description || (
              <p className=" text-gray-800">This is trust fund {fund}.</p>
            )} */}
            <p className=" text-gray-800">
              Ethena must rank as the top DeFi protocol by TVL on DeFiLlama for
              at least 7 consecutive days in Q1 2025, with TVL measured in USD
              from genuine user deposits; disqualifications include hacks over
              $10M, prolonged pauses, or TVL manipulation.
            </p>
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
          {/* <div className="flex items-center space-x-2">
            {strategy?.poolId && (
              <NewTrustFundApplication poolId={strategy?.poolId} />
            )}
          </div> */}
        </div>

        <div className=" w-1 hidden md:block">
          <Separator orientation="vertical" className="" />
        </div>

        <Tabs defaultValue="polls" className=" space-y-4 md:w-3/5 pt-6 md:pt-0">
          <div className="flex border-b ">
            <TabsList className=" bg-white">
              <TabsTrigger
                value="polls"
                className=" data-[state=active]:border-b-2 data-[state=active]:border-green-300 rounded-none  data-[state=active]:shadow-none text-lg"
              >
                Market
              </TabsTrigger>
              <TabsTrigger
                value="activities"
                className=" data-[state=active]:border-b-2 data-[state=active]:border-green-300 rounded-none  data-[state=active]:shadow-none text-lg"
              >
                Activities
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="polls" className="space-y-4">
            <YesNoChart />
            <div className=" flex gap-5 pt-5">
              <Input placeholder="Enter stake amount (USDe)" className="h-12" />
              <RadialChart />
            </div>
            <div className=" flex  gap-8 ">
              <Button className="w-full h-12 bg-green-500 hover:bg-green-400">
                Stake YES
              </Button>
              <Button className="w-full h-12 bg-red-500 hover:bg-red-400">
                Stake NO
              </Button>
            </div>
            {/* <div className="col-span-5 grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              {beneficiaries.length > 0 ? (
                beneficiaries.map((beneficiary) => (
                  <Beneficiary key={beneficiary.address} data={beneficiary} />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500">
                  No beneficiaries found
                </div>
              )}
            </div> */}
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            <div className="space-y-8">
              {recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 justify-between"
                >
                  <img
                    src={item.teamLogo}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="text-sm">
                      <span className="font-medium">{item.user}</span>{" "}
                      {item.action}{" "}
                      <span
                        className={
                          item.choice === "Yes"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {item.choice}
                      </span>{" "}
                      at (${item.amount})
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Fund;
