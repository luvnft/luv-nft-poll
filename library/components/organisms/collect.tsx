"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatEther } from "viem";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Button } from "@/components/atoms/button";
import { Separator } from "@/components/atoms/separator";
import useCapyProtocol from "@/hooks/use-capy-protocol";
import { GroupedStream } from "@/types";
import { cn, getInitials, isValidUrl } from "@/utils";

const CollectHead = ({ stream }: { stream: GroupedStream }) => {
  return (
    <div className="flex gap-5 items-center">
      <Avatar>
        <AvatarImage
          src={
            isValidUrl(stream.avatar) ||
            `https://avatar.vercel.sh/${stream.strategyAddress + stream.name}`
          }
          alt={`${stream.name} logo`}
        />
        <AvatarFallback>{getInitials(stream.name)}</AvatarFallback>
      </Avatar>

      <div className="flex items-start flex-col gap-2 text-gray-700">
        <h3 className="text-xl font-bold tracking-tight">{stream.name}</h3>
        <p className="text-sm w-fit">
          Total Allocation: <strong>{stream.totalAllocation} sUSDc</strong>
        </p>
      </div>
    </div>
  );
};

const CollectBody = ({ stream }: { stream: GroupedStream }) => {
  const { findOptimalCycles, fundsOut } = useCapyProtocol();
  const [optimalReceivableAmount, setOptimalReceivableAmount] = useState<{
    minNonZeroCycle: number;
    maxReceivableCycle: number;
    maxReceivableAmount: bigint;
  } | null>(null);
  const [isCollecting, setIsCollecting] = useState(false);

  useEffect(() => {
    const fetchOptimalCycles = async () => {
      const result = await findOptimalCycles(
        BigInt(stream.recipientDriverAccountId),
        stream.token as `0x${string}`,
        1_000_000_000
      );
      setOptimalReceivableAmount(result);

      console.log(result);
    };

    fetchOptimalCycles();
  }, [stream]);

  const handleReceiveAndCollect = async () => {
    if (!optimalReceivableAmount) return;

    setIsCollecting(true);
    try {
      await fundsOut({
        poolId: BigInt(stream.poolId),
        capyNftId: BigInt(stream.capyNftId),
        recipient: stream.recipient as `0x${string}`,
        maxCycles: optimalReceivableAmount.maxReceivableCycle,
        token: stream.token as `0x${string}`,
      });
      console.log("Funds collected successfully");
    } catch (error) {
      console.error("Error applying to trust fund:", error);
      toast.error(
        `Application failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsCollecting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <div className="flex flex-col gap-3">
          <div className=" flex justify-between items-center">
            <p className="text-sm text-gray-600">Creator</p>
            <a
              href={`/trust/${stream.strategyAddress}`}
              className="font-medium underline"
            >
              {stream.strategyAddress}
            </a>
          </div>
          <div className=" flex justify-between items-center">
            <p className="text-sm text-gray-600">Allocation</p>
            <p className=" font-medium">{stream.totalAllocation} sUSDc</p>
          </div>
          <div className=" flex justify-between items-center">
            <p className="text-sm text-gray-600">Duration</p>
            <p className=" font-medium">{stream.duration / 60} mins</p>
          </div>
          <div className=" flex justify-between items-start gap-4">
            <p className="text-sm text-gray-600">Created</p>
            <p className=" font-medium max">
              {(() => {
                const date = new Date(stream.createdAt);
                const formattedDate = date
                  .toISOString()
                  .slice(0, 19)
                  .replace("T", " ");
                return formattedDate;
              })()}
            </p>
          </div>
          <div className=" flex justify-between items-start gap-4">
            <p className="text-sm text-gray-600">Note</p>
            <p className=" font-medium max-w-[50ch]">{stream?.description}</p>
          </div>
        </div>
        <Separator
          className=" bg-slate-200 hidden sm:block my-4"
          orientation="horizontal"
        />
      </div>

      <div className="flex flex-col gap-6 text-gray-700 w-full">
        <div className="flex flex-row justify-between items-center">
          <div className=" flex flex-col">
            <p className=" text-sm">Receivable stream:</p>
            <p className=" font-medium">
              {optimalReceivableAmount?.maxReceivableAmount
                ? formatEther(optimalReceivableAmount.maxReceivableAmount)
                : "0"}{" "}
              sUSDe
            </p>
          </div>

          <Button
            className={cn(
              "bg-green-500 hover:bg-green-400 w-fit flex gap-20 h-[50px] px-4"
            )}
            onClick={handleReceiveAndCollect}
            disabled={isCollecting || !optimalReceivableAmount}
          >
            <p className=" text-black text-base">
              {isCollecting ? "Collecting..." : "Collect Funds"}
            </p>
            <div className="w-7 h-7 rounded-full bg-[#191A23] flex justify-center items-center">
              <ArrowUpRight
                strokeWidth={3}
                width={16}
                className=" text-green-500 "
              />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export { CollectBody, CollectHead };
