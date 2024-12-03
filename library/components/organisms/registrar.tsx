import { defineStepper } from "@stepperize/react";
import { ConnectKitButton } from "connectkit";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";

import useCapyProtocol from "@/hooks/use-capy-protocol";
import useStore from "@/store";
import { Button } from "@/components/atoms/button";
import { Card } from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import { Separator } from "@/components/atoms/separator";

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

const Profile = () => {
  const { createProfile } = useCapyProtocol();
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

const Wallet = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-4">
      <ConnectKitButton />
      <p className="text-sm text-muted-foreground">
        Connect your wallet to get started
      </p>
    </div>
  );
};

const Complete = () => {
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

const Registrar = () => {
  const stepper = useStepper();
  const { isConnected } = useAccount();

  // Auto-advance after wallet connection
  useEffect(() => {
    if (isConnected && stepper.current.id === "connect") {
      stepper.next();
    }
  }, [isConnected, stepper]);

  return (
    <div className=" none md:flex fixed inset-0 items-center justify-center">
      <Card className="w-[900px] p-6 flex flex-col md:flex-row items-center gap-20">
        <div>
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
                          index < stepper.current.index
                            ? "bg-primary"
                            : "bg-muted"
                        }`}
                      />
                    </div>
                  )}
                  {stepper.current.id === step.id && (
                    <div className="ml-14 mb-4">
                      {stepper.switch({
                        connect: () => <Wallet />,
                        profile: () => <Profile />,
                        complete: () => <Complete />,
                      })}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </ol>
          </nav>
        </div>

        <div className="md:w-1/2 order-1 md:order-2">
          <img src="trust-page.png" alt="On-chain token distribution" className="" />
        </div>
      </Card>
    </div>
  );
};

export default Registrar;
