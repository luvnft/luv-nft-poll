"use client";

import Image from "next/image";
import { formatEther } from "viem";

import { Alert, AlertDescription } from "@/components/atoms/alert";
import { Button } from "@/components/atoms/button";
import { Separator } from "@/components/atoms/separator";
import { useDripsManagement } from "@/hooks/use-drips-management";
import { FundingFlowState, Token } from "@/types";
import { cn } from "@/utils";

const CollectHead = (collect: { token: Token }) => {
  const { optimalReceivableAmount, splittableAmount, collectableAmount } =
    useDripsManagement(collect.token.address);

  const totalReceivableAmount =
    (optimalReceivableAmount || BigInt(0)) +
    (splittableAmount || BigInt(0)) +
    (collectableAmount || BigInt(0));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-4 items-center">
        <div className="relative w-fit">
          <Image
            src={`https://avatar.vercel.sh/${collect.token.address}`}
            alt={`${collect.token.symbol} logo`}
            width={48}
            height={48}
            className="aspect-[1] rounded-full h-fit w-fit object-cover"
          />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">
          {collect.token.address}
        </h3>
      </div>
      <div className="flex gap-2 p-1 rounded-lg text-gray-700">
        <p className="text-sm w-fit">
          Total Receivable: {formatEther(totalReceivableAmount)}{" "}
          {collect.token.symbol}
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
      <Alert variant="destructive">
        <AlertDescription>
          Clicking <strong>Collect Funds</strong> batches your receivable,
          splittable and collectable funds.
        </AlertDescription>
      </Alert>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-2 text-gray-700 text-base font-semibold w-full">
          <div className="flex flex-col">
            <p>
              Receivable Amount:{" "}
              {optimalReceivableAmount
                ? formatEther(optimalReceivableAmount)
                : "0"}{" "}
              {collect.token.symbol}
            </p>
            <p>
              Splittable Amount:{" "}
              {splittableAmount ? formatEther(splittableAmount) : "0"}{" "}
              {collect.token.symbol}
            </p>
            <p>
              Collectable Amount:{" "}
              {collectableAmount ? formatEther(collectableAmount) : "0"}{" "}
              {collect.token.symbol}
            </p>
          </div>

          <p className="text-gray-500 font-bold text-xs">
            Total Receivable: {formatEther(totalReceivableAmount)}{" "}
            {collect.token.name}
          </p>
        </div>
        <div className="flex w-full gap-2 items-center">
          <Separator
            className=" bg-slate-200 hidden sm:block"
            orientation="vertical"
          />
          <Button
            className={cn("bg-zinc-800 text-white hover:bg-zinc-700 w-full")}
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
            {isReceiving || isReceiveStreamsProcessing
              ? "Processing Streams..."
              : isSpliting || isSplitProcessing
                ? "Splitting Funds..."
                : isCollecting || isCollectProcessing
                  ? "Collecting..."
                  : "Collect Funds"}
          </Button>
        </div>
      </div>
      {collect.fundingFlows.map((flow) => {
        const date = new Date(flow.createdAt);
        const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");
        return (
          <div key={flow.createdAt} className="flex flex-col gap-1">
            <Separator
              className=" bg-slate-200 hidden sm:block"
              orientation="horizontal"
            />
            <div className="flex gap-2">
              {flow.creator && (
                <p className="text-sm text-gray-600">Creator: {flow.creator}</p>
              )}
              <p className="text-sm text-gray-600">
                Allocation: {flow.allocation} {flow.token?.symbol}
              </p>
              <p className="text-sm text-gray-600">
                Duration: {parseInt(flow.duration) / 60} mins
              </p>
            </div>
            <p className="text-sm text-gray-600">{flow.description}</p>
            <p className="text-[#4C505F] text-sm italic">{formattedDate}</p>
          </div>
        );
      })}
    </div>
  );
};

export { CollectBody, CollectHead };
