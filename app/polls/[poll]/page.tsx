"use client";

import { format, formatDistanceToNow } from "date-fns";
import { ArrowUpRight, Check, Clock, Loader } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Address } from "viem";
import { useAccount } from "wagmi";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import { Separator } from "@/components/atoms/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/tabs";
import { RadialChart } from "@/components/organisms/radial-chart";
import { YesNoChart } from "@/components/organisms/yes-no-chart";
import useCapyProtocol from "@/hooks/use-capy-protocol-new";
import { useMounted } from "@/hooks/use-mounted";
import { ellipsisAddress, getInitials, isValidUrl } from "@/utils";

const Poll = () => {
  const params = useParams();
  const pollAddress = params.poll as Address;
  const isMounted = useMounted();
  const [isStaking, setIsStaking] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [stakeAmount, setStakeAmount] = useState(0);

  const { stake, withdrawFunds, poll, updateParams } = useCapyProtocol();
  const { address } = useAccount();

  useEffect(() => {
    updateParams({ pollAddress });
  }, [pollAddress, updateParams]);

  const handleStake = async (position: boolean) => {
    if (!address) {
      toast.error("Please connect wallet");
      return;
    }

    if (!stakeAmount) return;

    setIsStaking(true);
    try {
      await stake({
        pollAddress,
        amount: stakeAmount,
        position,
      });
      toast.success(
        `Successfully staked ${stakeAmount} USDe for ${position ? "YES" : "NO"}`
      );
    } catch (error) {
      if (error instanceof Error && error.message.includes("0xe450d38c")) {
        toast.error(
          "Please fund your wallet with USDe tokens to create a poll"
        );
      }
      console.error("Error staking:", error);
      toast.error("Failed to stake funds");
    } finally {
      setIsStaking(false);
    }
  };

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    try {
      await withdrawFunds({ pollAddress });
      toast.success("Successfully withdrew funds");
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      toast.error("Failed to withdraw funds");
    } finally {
      setIsWithdrawing(false);
    }
  };

  const currentTime = Date.now();
  const isRegistrationOpen =
    poll.data?.startDate &&
    poll.data?.endDate &&
    currentTime >= poll.data?.startDate &&
    currentTime <= poll.data?.endDate;

  if (!isMounted) return null;
  if (poll.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader className="animate-spin text-gray-500 mt-36 mb-4" size={24} />
        <p className="text-gray-700">Loading poll...</p>
      </div>
    );
  }
  if (poll.error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        {poll.error?.message}
      </div>
    );
  }
  if (!poll.data?.pollAddress) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 mt-32">
        Poll does not exist yet
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
                  isValidUrl(poll.data?.avatar ?? "")
                    ? poll.data?.avatar
                    : `https://avatar.vercel.sh/${
                        (poll.data?.pollAddress ?? "") +
                        (poll.data?.question ?? "")
                      }`
                }
                alt={`${poll.data?.question ?? "Poll"} logo`}
              />
              <AvatarFallback>
                {getInitials(poll.data?.question ?? "")}
              </AvatarFallback>
            </Avatar>

            <h2 className="text-3xl font-bold tracking-tight">
              {poll.data.question}
            </h2>
          </div>

          <div className=" ">
            <p className=" text-gray-800">{poll.data?.description}</p>
            {!isRegistrationOpen && poll.data?.endDate && (
              <p className="text-sm text-gray-500 mt-2">
                Registration closed{" "}
                {formatDistanceToNow(new Date(Number(poll.data?.endDate)), {
                  addSuffix: true,
                })}{" "}
                (ends {format(new Date(Number(poll.data?.endDate)), "PPp")})
              </p>
            )}
            {isRegistrationOpen &&
              poll.data?.startDate &&
              poll.data?.endDate && (
                <p className="text-sm text-gray-500 mt-2">
                  Registration open:{" "}
                  {formatDistanceToNow(new Date(Number(poll.data?.endDate)), {
                    addSuffix: true,
                  })}{" "}
                  remaining (from{" "}
                  {format(new Date(Number(poll.data?.startDate)), "PPp")} to{" "}
                  {format(new Date(Number(poll.data?.endDate)), "PPp")})
                </p>
              )}
          </div>

          <div className="">
            <Card className=" flex">
              <div className=" w-1/2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Poll Contract
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {ellipsisAddress(poll.data?.pollAddress)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Deployed{" "}
                    {formatDistanceToNow(
                      new Date(Number(poll.data?.startDate)),
                      {
                        addSuffix: true,
                      }
                    )}
                  </p>
                </CardContent>
              </div>

              <div className=" w-1 flex items-center">
                <Separator orientation="vertical" className=" h-3/4" />
              </div>

              <div className=" w-1/2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Staked
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-2xl font-bold">
                    {Number(poll.data?.poolSize).toFixed(3)}&nbsp;{" "}
                    <span className="text-lg font-medium">USDe</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +0% from last month
                  </p>
                </CardContent>
              </div>
            </Card>
          </div>
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

          <TabsContent value="polls" className="space-y-10">
            <YesNoChart data={poll.data.timeSeriesData} />

            {isRegistrationOpen ? (
              <>
                <div className=" flex gap-5 pt-5">
                  <Input
                    placeholder="Enter stake amount (USDe)"
                    className="h-12"
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(Number(e.target.value))}
                  />
                  <RadialChart data={poll.data.radialData} />
                </div>
                <div className=" flex  gap-8 ">
                  <Button
                    className="w-full h-12 bg-green-500 hover:bg-green-400"
                    onClick={() => handleStake(true)}
                    disabled={isStaking || !stakeAmount}
                  >
                    {isStaking ? "Staking..." : "Stake YES"}
                  </Button>
                  <Button
                    className="w-full h-12 bg-red-500 hover:bg-red-400"
                    onClick={() => handleStake(false)}
                    disabled={isStaking || !stakeAmount}
                  >
                    {isStaking ? "Staking..." : "Stake NO"}
                  </Button>
                </div>
              </>
            ) : poll.data?.status === "resolved" ? (
              <div className=" border border-gray-200 p-8 rounded-2xl justify-between items-end mt-10">
                <div className=" pb-3">
                  <div className=" flex gap-3 items-center">
                    <div
                      className={` ${
                        poll.data?.winner === "Yes"
                          ? " bg-green-200"
                          : " bg-red-200"
                      } min-w-12 h-12 rounded-full grid place-items-center`}
                    >
                      <Check
                        size={30}
                        strokeWidth={3}
                        className={` ${
                          poll.data?.winner === "Yes"
                            ? " text-green-500"
                            : " text-red-500"
                        }`}
                      />
                    </div>
                    <h2 className="text-2xl font-semibold leading-none tracking-tight">
                      Results are in! {poll.data?.winner} Won 🎯
                    </h2>
                  </div>
                  <p className=" text-gray-800 text-lg pt-2">
                    For {poll.data?.winner} voters, your tokens retain their
                    full value—boosted by the interest yield from
                    everyone&apos;s stakes. Hold or trade your{" "}
                    {poll.data?.winner} tokens as you like. You can also
                    withdraw your USDE stake anytime. <br />
                    For {poll.data?.winner === "Yes" ? " No" : " Yes"} voters,
                    prepare for the double-blitz with 500x inflation in 24 hours
                    and another 500x in 48 hours. Withdraw your USDE
                    stake—it&apos;s no-loss, and your
                    {poll.data?.winner === "Yes" ? " No" : " Yes"} tokens are
                    now purely for entertainment!{" "}
                  </p>
                </div>
                <div className=" flex justify-end">
                  <button
                    className="bg-[#33CB82] hover:bg-[#33CB82]/80 rounded-[14px] h-[50px] px-4 flex items-center gap-5"
                    onClick={handleWithdraw}
                    disabled={isWithdrawing}
                  >
                    {isWithdrawing ? "Withdrawing..." : "Withdraw Funds"}
                    <div className="w-7 h-7 rounded-full bg-[#191A23] flex justify-center items-center">
                      <ArrowUpRight
                        strokeWidth={3}
                        width={16}
                        className=" text-green-500 "
                      />
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="border border-gray-200 p-8 rounded-2xl mt-10">
                <div className="flex gap-3 items-center">
                  <div className="min-w-12 h-12 rounded-full grid place-items-center bg-yellow-100">
                    <Clock
                      size={30}
                      strokeWidth={3}
                      className="text-yellow-600"
                    />
                  </div>
                  <h2 className="text-2xl font-semibold leading-none tracking-tight">
                    Registration Closed - Awaiting Results
                  </h2>
                </div>
                <p className="text-gray-800 text-lg pt-2">
                  The registration period has ended and results are being
                  determined. Once resolved, you'll be able to see the outcome
                  and manage your stake. Stay tuned!
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            <div className="space-y-8">
              {poll.data.recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 justify-between"
                >
                  <img
                    src={item.avatar}
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

export default Poll;
