"use client";

import Image from "next/image";
import { formatEther } from "viem";

import { Alert, AlertDescription } from "@/components/atoms/alert";
import { Button } from "@/components/atoms/button";
import { Separator } from "@/components/atoms/separator";
import { useDripsManagement } from "@/hooks/use-drips-management";
import { FundingFlowState, Token } from "@/types";
import { cn, ellipsisAddress } from "@/utils";
import { MoveUpRight } from "lucide-react";

const CollectHead = (collect: { token: Token }) => {
  const { optimalReceivableAmount, splittableAmount, collectableAmount } =
    useDripsManagement(collect.token.address);

  const totalReceivableAmount =
    (optimalReceivableAmount || BigInt(0)) +
    (splittableAmount || BigInt(0)) +
    (collectableAmount || BigInt(0));

  return (
    <div className="flex gap-5 items-center">
      
      <div className="relative w-fit">
        <Image
          src={`https://avatar.vercel.sh/${collect.token.address}`}
          alt={`${collect.token.symbol} logo`}
          width={48}
          height={48}
          className="aspect-[1] rounded-full h-fit w-fit object-cover"
        />
      </div>

      <div className="flex flex-col gap-2 text-gray-700">
        <h3 className=" font-medium">
          {ellipsisAddress(collect.token.address, 8)}
        </h3>
        <p className="text-sm w-fit">
          Total Receivable:{" "}
          <strong>
            {" "}
            {formatEther(totalReceivableAmount)} {collect.token.symbol}
          </strong>
        </p>
      </div>
    </div>
  );
};

const CollectBody = (collect: {
  token: Token;
  fundingFlows: FundingFlowState[];
}) => {
  const {
    optimalReceivableAmount,
    splittableAmount,
    collectableAmount,
    handleReceiveAndCollect,
    isReceiving,
    isReceiveStreamsProcessing,
    isSpliting,
    isSplitProcessing,
    isCollecting,
    isCollectProcessing,
  } = useDripsManagement(collect.token.address);

  const totalReceivableAmount =
    (optimalReceivableAmount || BigInt(0)) +
    (splittableAmount || BigInt(0)) +
    (collectableAmount || BigInt(0));

  return (
    <div className="flex flex-col gap-4">
      <Alert>
        <AlertDescription>
          Clicking <strong>Collect Funds</strong> batches your receivable,
          splittable and collectable funds.
        </AlertDescription>
      </Alert>

      <div className="flex flex-col gap-6 text-gray-700 w-full">
        <div className="flex flex-row justify-between">
          <div className=" flex flex-col gap-4">
            <p className=" text-sm">Receivable</p>
            <p className=" font-medium">
              {optimalReceivableAmount
                ? formatEther(optimalReceivableAmount)
                : "0"}{" "}
              {collect.token.symbol}
            </p>
          </div>
          <div className=" flex flex-col gap-4">
            <p className=" text-sm">Splittable</p>
            <p className=" font-medium">
              {splittableAmount ? formatEther(splittableAmount) : "0"}{" "}
              {collect.token.symbol}
            </p>
          </div>
          <div className=" flex flex-col gap-4">
            <p className=" text-sm">Collectable</p>
            <p className=" font-medium">
              {collectableAmount ? formatEther(collectableAmount) : "0"}{" "}
              {collect.token.symbol}
            </p>
          </div>
        </div>

        <p className="text-gray-500 font-bold text-xs">
          Total Receivable: {formatEther(totalReceivableAmount)}{" "}
          {collect.token.name}
        </p>

        <Button
          className={cn(
            "bg-green-500 hover:bg-green-400 w-fit flex gap-20 h-[50px] px-4"
          )}
          onClick={handleReceiveAndCollect}
          disabled={
            isReceiving ||
            isReceiveStreamsProcessing ||
            isSpliting ||
            isSplitProcessing ||
            isCollecting ||
            isCollectProcessing ||
            totalReceivableAmount <= BigInt(0)
          }
        >
          <p className=" text-black text-base">
            {isReceiving || isReceiveStreamsProcessing
              ? "Processing Streams..."
              : isSpliting || isSplitProcessing
              ? "Splitting Funds..."
              : isCollecting || isCollectProcessing
              ? "Collecting..."
              : "Collect Funds"}
          </p>
          <div className="w-7 h-7 rounded-full bg-[#191A23] flex justify-center items-center">
            <MoveUpRight
              strokeWidth={3}
              width={16}
              className=" text-green-500 "
            />
          </div>
        </Button>
      </div>

      {collect.fundingFlows.map((flow) => {
        const date = new Date(flow.createdAt);
        const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");
        return (
          <div key={flow.createdAt} className="flex flex-col">
            <Separator
              className=" bg-slate-200 hidden sm:block my-4"
              orientation="horizontal"
            />
            <div className="flex flex-col gap-3">
              {flow.creator && (
                <div className=" flex justify-between items-center">
                  <p className="text-sm text-gray-600">Creator</p>
                  <p className=" font-medium">{flow.creator}</p>
                </div>
              )}

              <div className=" flex justify-between items-center">
                <p className="text-sm text-gray-600">Allocation</p>
                <p className=" font-medium">{flow.allocation} {flow.token?.symbol}</p>
              </div>
              <div className=" flex justify-between items-center">
                <p className="text-sm text-gray-600">Duration</p>
                <p className=" font-medium">{parseInt(flow.duration) / 60} mins</p>
              </div>
              <div className=" flex justify-between items-center">
                <p className="text-sm text-gray-600">Note/Date</p>
                <p className=" font-medium">{flow.description}/ {formattedDate} </p>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};

export { CollectBody, CollectHead };
