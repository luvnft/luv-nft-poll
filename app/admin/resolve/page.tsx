"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Hash } from "viem";
import { useAccount } from "wagmi";
import { Loader2, AlertTriangle } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/atoms/form";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { Card, CardContent } from "@/components/atoms/card";
import { toast } from "sonner";
import useCapyProtocol from "@/hooks/use-capy-protocol-new";
import { ADMIN_ADDRESS } from "@/constants";

const FormSchema = z.object({
  pollAddress: z.string().startsWith("0x", "Must be a valid address"),
});

export default function AdminResolvePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { address } = useAccount();
  const { resolvePoll } = useCapyProtocol();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pollAddress: "",
    },
  });

  // Check if user is admin
  if (address !== ADMIN_ADDRESS) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-red-500 mb-2">Unauthorized Access</h1>
        <p className="text-gray-600">Only admin can access this page.</p>
      </div>
    );
  }

  const handleResolve = async (winningPosition: boolean) => {
    const values = form.getValues();
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsSubmitting(true);
    try {
      await resolvePoll({
        pollAddress: values.pollAddress as Hash,
        winningPosition,
      });
      toast.success("Poll resolved successfully!");
      form.reset();
    } catch (error) {
      console.error("Error resolving poll:", error);
      toast.error(error instanceof Error ? error.message : "Failed to resolve poll");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50/50">
      <div className="w-full max-w-2xl px-4">
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Warning Banner */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-md">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3" />
                  <p className="text-sm text-yellow-700">
                    Demo Interface Only: In production, polls will be resolved by an automated oracle system.
                  </p>
                </div>
              </div>

              {/* Header */}
              <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold tracking-tight text-black">
                  Resolve Poll
                </h1>
                <p className="text-gray-600">
                  Admin interface for resolving prediction market outcomes
                </p>
              </div>

              {/* Form */}
              <Form {...form}>
                <form className="space-y-8">
                  <FormField
                    control={form.control}
                    name="pollAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-lg">Poll Address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="0x..." 
                            {...field}
                            className="h-14 text-lg font-mono"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleResolve(true)}
                      className="flex-1 h-14 text-lg font-semibold bg-green-500 hover:bg-green-600 text-white transition-all duration-200 shadow-lg hover:shadow-green-200"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        "Yes Wins"
                      )}
                    </Button>
                    <Button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleResolve(false)}
                      className="flex-1 h-14 text-lg font-semibold bg-red-500 hover:bg-red-600 text-white transition-all duration-200 shadow-lg hover:shadow-red-200"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        "No Wins"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
