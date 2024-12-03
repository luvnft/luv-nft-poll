"use client";

import { AlertTriangle, ArrowUpRight, Loader } from "lucide-react";
import Image from "next/image";
import { Suspense, useState } from "react";
import { Address } from "viem";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/atoms/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/atoms/alert";
import { Input } from "@/components/atoms/input";
import { CollectBody, CollectHead } from "@/components/organisms/collect";
import { FundingFlowState, Token } from "@/types";

type GroupedFlows = {
  token: Token;
  fundingFlows: FundingFlowState[];
};

const sampleGroupedFlows: GroupedFlows[] = [
  {
    token: {
      name: "Ethereum",
      symbol: "ETH",
      address: "0x0000000000000000000000000000000000000000" as Address,
    },
    fundingFlows: [
      {
        address: "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1",
        emojiCodePoint: "1F98D",
        token: null,
        description: "Monthly Trust Fund Payment",
        duration: "30 days",
        allocation: "1.5",
        recipient: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" as Address,
        creator: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" as Address,
        createdAt: "2024-01-15",
      },
      {
        address: "0x67d269191c92Caf3cD7723F116c85e6E9bf55933",
        emojiCodePoint: "1F4B0",
        token: null,
        description: "Weekly Allowance",
        duration: "7 days",
        allocation: "0.5",
        recipient: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC" as Address,
        creator: "0x90F79bf6EB2c4f870365E785982E1f101E93b906" as Address,
        createdAt: "2024-01-10",
      },
    ],
  },
  {
    token: {
      name: "Test Token",
      symbol: "TEST",
      address: "0x5FbDB2315678afecb367f032d93F642f64180aa3" as Address,
    },
    fundingFlows: [
      {
        address: "0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E",
        emojiCodePoint: "1F4B8",
        token: null,
        description: "Quarterly Distribution",
        duration: "90 days",
        allocation: "1000",
        recipient: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65" as Address,
        creator: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc" as Address,
        createdAt: "2024-01-01",
      },
    ],
  },
];

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <Loader className="animate-spin text-gray-500 -mt-36 mb-4" size={24} />
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
        src="error-state.svg"
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
      <Image alt="empty state" src="empty-state.svg" width={120} height={120} />
      <h2 className="text-sm text-center sm:text-xl text-black mt-4">
        Available streams will show <br /> here after scan
      </h2>
    </div>
  </div>
);

const CollectFlows = ({ groupedFlows }: { groupedFlows: GroupedFlows[] }) => (
  <Accordion type="multiple" className="w-full flex flex-col gap-2">
    {groupedFlows.map((group, index) => (
      // <Card key={index} className="rounded-lg p-0">
      <AccordionItem key={index} value={`${index}`} className="border-b">
        <AccordionTrigger className="p-4">
          <CollectHead token={group.token} />
        </AccordionTrigger>
        <AccordionContent className="pb-4 px-4">
          <CollectBody token={group.token} fundingFlows={group.fundingFlows} />
        </AccordionContent>
      </AccordionItem>
      // </Card>
    ))}
  </Accordion>
);

const CollectPage = () => {
  const [groupedFlows] = useState(sampleGroupedFlows);
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }
    if (error) {
      return <ErrorState error={error} />;
    }
    if (groupedFlows.length === 0) {
      return <EmptyState />;
    }
    return <CollectFlows groupedFlows={groupedFlows} />;
  };

  return renderContent();
};

const CollectPageWithSuspense = () => {
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
                className="flex-1 border px-7 rounded-lg h-[50px] text-sm outline-none focus-visible:ring-1 focus-visible:ring-green-500"
              />
              <button className="bg-green-500 rounded-lg h-[50px] px-4 flex items-center gap-5">
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
            <CollectPage />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default CollectPageWithSuspense;
