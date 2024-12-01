"use client";

import { ConnectKitButton } from "connectkit";
import React, { useEffect, useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import { Separator } from "@/components/atoms/separator";
import { defineStepper } from "@stepperize/react";
import useStore from "@/store";
import { useTrustStrategy } from "@/hooks/use-trust-strategy";
import { Address } from "viem";
import FundLink from "@/components/molecules/link-fund";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/tabs";
import NewTrustFund from "@/components/organisms/new-trust-fund";
import { toast } from "sonner";
import { useMounted } from "@/hooks/use-mounted";

const { useStepper, steps } = defineStepper(
  {
    id: "connect",
    title: "Connect Wallet",
    description: "Connect and sign-in to start using CapyFlows",
  },
  {
    id: "profile",
    title: "Create Profile",
    description: "Set up your profile for trust management",
  },
  {
    id: "complete",
    title: "Complete",
    description: "Setup complete!",
  }
);

const WalletComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-4">
      <ConnectKitButton />
      <p className="text-sm text-muted-foreground">
        Connect your wallet to get started
      </p>
    </div>
  );
};

const ProfileComponent = () => {
  const { createProfile } = useTrustStrategy();
  const [name, setName] = useState("");
  const [poolId, setPoolId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { address } = useAccount();
  const { setCurrentProfile } = useStore();
  const stepper = useStepper();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!address) return;

    try {
      setIsSubmitting(true);
      const params = await createProfile({
        nonce: BigInt(poolId),
        name,
        metadata: {
          protocol: BigInt(0),
          pointer: "",
        },
        owner: address,
        members: [],
      });
      setCurrentProfile({ id: params.id, name });
      stepper.next();
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("NONCE_NOT_AVAILABLE()")
      ) {
        toast.error("You've used the id already. Please try another.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 w-full">
      <div className="grid gap-2">
        <label htmlFor="name" className="text-sm font-medium text-start">
          Name
        </label>
        <Input
          id="name"
          placeholder="Enter your name"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
          required
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="poolId" className="text-sm font-medium text-start">
          Unique ID
        </label>
        <Input
          id="poolId"
          type="number"
          placeholder="Enter pool ID"
          value={poolId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPoolId(e.target.value)
          }
          required
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Profile"}
      </Button>
    </form>
  );
};

const CompleteComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div
        className="p-8 rounded-lg mb-4"
        style={{
          background: `linear-gradient(135deg, #33CB82B2 0%, #FFDF52B2 100%)`,
        }}
      >
        <h3 className="text-2xl font-bold text-white mb-2">
          🎉 Welcome to CapyFlows!
        </h3>
        <p className="text-white/90">
          Your profile has been created successfully.
        </p>
      </div>
    </div>
  );
};

const LoadingState = () => {
  const stepper = useStepper();
  const { isConnected } = useAccount();

  // Auto-advance after wallet connection
  useEffect(() => {
    if (isConnected && stepper.current.id === "connect") {
      stepper.next();
    }
  }, [isConnected, stepper]);

  return (
    <Card className="w-[450px] p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-lg font-medium">Setup CapyFlows</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Step {stepper.current.index + 1} of {steps.length}
          </span>
        </div>
      </div>

      <nav aria-label="Setup Steps" className="group mb-6">
        <ol className="flex flex-col gap-2">
          {stepper.all.map((step, index, array) => (
            <React.Fragment key={step.id}>
              <li className="flex items-center gap-4">
                <Button
                  type="button"
                  variant={
                    index <= stepper.current.index ? "default" : "secondary"
                  }
                  className="flex size-10 items-center justify-center rounded-full"
                  disabled={!isConnected && step.id !== "connect"}
                >
                  {index + 1}
                </Button>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{step.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {step.description}
                  </span>
                </div>
              </li>
              {index < array.length - 1 && (
                <div className="ml-5 py-4">
                  <Separator
                    orientation="vertical"
                    className={`h-full ${
                      index < stepper.current.index ? "bg-primary" : "bg-muted"
                    }`}
                  />
                </div>
              )}
              {stepper.current.id === step.id && (
                <div className="ml-14 mb-4">
                  {stepper.switch({
                    connect: () => <WalletComponent />,
                    profile: () => <ProfileComponent />,
                    complete: () => <CompleteComponent />,
                  })}
                </div>
              )}
            </React.Fragment>
          ))}
        </ol>
      </nav>
    </Card>
  );
};

const ErrorState = ({ error }: { error: Error }) => (
  <div className="flex flex-col items-center justify-center h-full gap-4"></div>
);

const Content = () => {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Trust Dashboard</h2>

      <Tabs defaultValue="overview" className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trusts">Trusts</TabsTrigger>
            <TabsTrigger value="notifications" disabled>
              Notifications
            </TabsTrigger>
            <TabsTrigger value="settings" disabled>
              Settings
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            <NewTrustFund />
          </div>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Overview</h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Distributed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ongoing Streams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">350</div>
                <p className="text-xs text-muted-foreground">
                  0% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Beneficiaries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">573</div>
                <p className="text-xs text-muted-foreground">
                  +201 since last week
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 min-h-[100vh] md:min-h-min">
              <CardHeader>
                <CardTitle>Funding Summary</CardTitle>
              </CardHeader>
              <CardContent>something here</CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Actions</CardTitle>
                <CardDescription>
                  You took 265 actions this month.
                </CardDescription>
              </CardHeader>
              <CardContent>something here</CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trusts" className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Trust Funds</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <FundLink
              id={0}
              name={"Don't know"}
              description={"Happy "}
              emojiCodePoint={"1F600"}
            />
            <FundLink
              id={1}
              name={"Ethena Foundation"}
              description={"Happy Men"}
              emojiCodePoint={"1F601"}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const TrustPage = () => {
  const { profile } = useStore();
  const [isLoading, setIsLoading] = useState(!profile.id);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useMounted();

  const renderContent = useCallback(() => {
    if (!profile.id) { // TODO: you can put true here to trigger the loading state
      return <LoadingState />;
    }
    if (error) {
      return <ErrorState error={error} />;
    }
    return <Content />;
  }, [isLoading, error, profile.id]);

  if (!isMounted) return null;

  return renderContent();
};

export default TrustPage;
