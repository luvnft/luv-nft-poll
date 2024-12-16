"use client";

import { AlertTriangle, ArrowUpRight, Loader } from "lucide-react";
import Image from "next/image";
import { Suspense, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/atoms/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/atoms/alert";
import { Input } from "@/components/atoms/input";
import { CollectBody, CollectHead } from "@/components/organisms/collect";
import { useCollectableData } from "@/hooks/use-collectable-data";
import { GroupedStream } from "@/types";

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <Loader className="animate-spin text-gray-500 mt-36 mb-4" size={24} />
    <p className="text-gray-700">Loading flows...</p>
  </div>
);

const ErrorState = ({ error }: { error: Error }) => (
  <div className="flex flex-col items-center justify-center h-full gap-4">
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error.message ||
          "An error occurred while fetching flows. Please try again later."}
      </AlertDescription>
    </Alert>
    <div className="flex flex-col items-center justify-center">
      <Image
        alt="errors happeneth"
        src="/error-state.svg"
        width={120}
        height={120}
      />
      <h2 className="text-sm text-center sm:text-xl text-black mt-4">
        {error.message || (
          <>
            Oups no trust available for <br /> this address
          </>
        )}
      </h2>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full ">
    <div className="flex flex-col items-center justify-center">
      <Image alt="empty state" src="/empty-state.svg" width={120} height={120} />
      <h2 className="text-sm text-center sm:text-xl text-black mt-4">
        Available streams will show <br /> here after scan
      </h2>
    </div>
  </div>
);

const CollectFlows = ({
  groupedStream,
}: {
  groupedStream: GroupedStream[];
}) => (
  <Accordion type="multiple" className="w-full flex flex-col gap-2">
    {groupedStream.map((group, index) => (
      <AccordionItem key={index} value={`${index}`}>
        <AccordionTrigger className="p-4">
          <CollectHead stream={group} />
        </AccordionTrigger>
        <AccordionContent className="pb-4 px-4">
          <CollectBody stream={group} />
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);

const CollectPage = ({ address }: { address: string }) => {
  const { getCollectableData } = useCollectableData();
  const { data, isLoading, error } = getCollectableData(address);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }
    if (error) {
      return <ErrorState error={error} />;
    }
    if (data.length === 0) {
      return <EmptyState />;
    }
    return <CollectFlows groupedStream={data} />;
  };

  return renderContent();
};

const CollectPageWithSuspense = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [submittedAddress, setSubmittedAddress] = useState("");

  const handleScan = () => {
    setSubmittedAddress(walletAddress);
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Collectables</h2>
      <div className=" flex-1 flex items-center justify-center">
        <div className=" rounded-3xl border border-gray-200 p-3 md:p-7 max-w-2xl w-full overflow-auto min-h-[640px] flex flex-col gap-7">
          {/* header */}
          <div className=" flex flex-col gap-5 mx-[-28px] px-7 border-b border-gray-200">
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold text-xl text-gray-800">
                Discover Your Collectables
              </h3>
              <p className="text-gray-600">
                Scan your wallet to view and claim sUSDe tokens
              </p>
            </div>
            <div className="flex items-center gap-2.5 mb-6">
              <Input
                type="text"
                placeholder="Paste wallet address here"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="flex-1 border px-7 rounded-lg h-[50px] text-sm outline-none focus-visible:ring-1 focus-visible:ring-green-500"
              />
              <button
                onClick={handleScan}
                className="bg-[#33CB82] hover:bg-[#33CB82]/80 rounded-[14px] h-[50px] px-4 flex items-center gap-5"
                disabled={!walletAddress}
              >
                Scan
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

          <Suspense fallback={<LoadingState />}>
            <CollectPage address={submittedAddress} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default CollectPageWithSuspense;
