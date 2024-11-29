"use client";

import { AlertTriangle, Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";
import { Address } from "viem";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/atoms/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/atoms/alert";
import { Card } from "@/components/atoms/card";
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
        src="https://illustrations.popsy.co/red/timed-out-error.svg"
        width={350}
        height={350}
      />
      <h2 className="text-sm text-center sm:text-xl text-black mt-4">
        {error.message || "Errors happeneth"}
      </h2>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full gap-4">
    <div className="flex flex-col items-center justify-center">
      <Image
        alt="empty state"
        src="https://illustrations.popsy.co/red/earning-money.svg"
        width={350}
        height={350}
      />
      <h2 className="text-sm text-center sm:text-xl text-black mt-4">
        Empty flows, full potential. Cast away!
      </h2>
    </div>
  </div>
);

const CollectFlows = ({ groupedFlows }: { groupedFlows: GroupedFlows[] }) => (
  <Accordion type="multiple" className="w-full flex flex-col gap-2">
    {groupedFlows.map((group, index) => (
      <Card key={index} className="rounded-lg p-0">
        <AccordionItem value={`${index}`} className="border-b-0">
          <AccordionTrigger className="p-4">
            <CollectHead token={group.token} />
          </AccordionTrigger>
          <AccordionContent className="pb-4 px-4">
            <CollectBody
              token={group.token}
              fundingFlows={group.fundingFlows}
            />
          </AccordionContent>
        </AccordionItem>
      </Card>
    ))}
  </Accordion>
);

const CollectPage = () => {
  const [groupedFlows, setGroupedFlows] = useState(sampleGroupedFlows);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

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
    <>
      <header>
        <h1 className="pt-4 px-4 font-semibold text-xl">Collect</h1>
        <p className="px-4 pb-2 text-sm text-gray-700">
          Collect and view funding flow details
        </p>
      </header>
      <main className="rounded-2xl bg-[#F8F8F7] p-4 flex-1 flex flex-col gap-4">
        <Alert>
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            Have anyone on the{" "}
            <Link href="/flows" className="text-[#FA4A57] hover:underline">
              Flows
            </Link>{" "}
            page send you flows and its link to start collecting
          </AlertDescription>
        </Alert>
        <Suspense fallback={<LoadingState />}>
          <CollectPage />
        </Suspense>
      </main>
    </>
  );
};

export default CollectPageWithSuspense;
