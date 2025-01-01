"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Info } from "lucide-react";

import { Button } from "@/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/atoms/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/atoms/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/atoms/form";
import { Input } from "@/components/atoms/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/atoms/tooltip";
import TokenSelect from "@/components/molecules/select-token";
import { useMediaQuery } from "@/hooks/use-media-query";
import useCapyProtocol from "@/hooks/use-capy-protocol";
import useStore from "@/store";
import { Token } from "@/types";
import { useAccount } from "wagmi";

type TimeUnit = "seconds" | "minutes" | "hours" | "days" | "weeks";

const FormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  avatarUrl: z.string().optional(),
  token: z
    .any()
    .refine((val) => val !== null, { message: "Token is required" }),
  amount: z.number().min(1, { message: "Amount must be greater than 0" }),
  description: z.string().optional(),
  registrationStartValue: z.number().min(1),
  registrationStartUnit: z.enum([
    "seconds",
    "minutes",
    "hours",
    "days",
    "weeks",
  ]),
  registrationEndValue: z.number().min(1),
  registrationEndUnit: z.enum(["seconds", "minutes", "hours", "days", "weeks"]),
  allocationStartValue: z.number().min(1),
  allocationStartUnit: z.enum(["seconds", "minutes", "hours", "days", "weeks"]),
  allocationEndValue: z.number().min(1),
  allocationEndUnit: z.enum(["seconds", "minutes", "hours", "days", "weeks"]),
});

const NewTrustFund = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { token } = useStore();
  const { deployTrust } = useCapyProtocol();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const emojiPickerContainerRef = useRef<HTMLDivElement>(null);
  const { address } = useAccount();

  const tokens: Token[] = [
    {
      symbol: "USDe",
      name: "Ethena USD",
      address: token.USDe,
    },
  ];

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      avatarUrl: "",
      token: null,
      amount: 0,
      description: "",
      registrationStartValue: 1,
      registrationStartUnit: "seconds",
      registrationEndValue: 3,
      registrationEndUnit: "minutes",
      allocationStartValue: 1,
      allocationStartUnit: "seconds",
      allocationEndValue: 5,
      allocationEndUnit: "minutes",
    },
  });

  const getMilliseconds = (value: number, unit: TimeUnit) => {
    const multipliers = {
      seconds: 1000,
      minutes: 60 * 1000,
      hours: 60 * 60 * 1000,
      days: 24 * 60 * 60 * 1000,
      weeks: 7 * 24 * 60 * 60 * 1000,
    };
    return value * multipliers[unit];
  };

  const getUnixTimestamps = (
    startValue: number,
    startUnit: TimeUnit,
    endValue: number,
    endUnit: TimeUnit,
    baseTimestamp?: number
  ) => {
    const now = baseTimestamp || Date.now();
    const startOffset = getMilliseconds(startValue, startUnit);
    const endOffset = getMilliseconds(endValue, endUnit);

    const startTimestamp = Math.floor((now + startOffset) / 1000);
    const endTimestamp = Math.floor((now + startOffset + endOffset) / 1000);

    return { startTimestamp, endTimestamp };
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!address) {
      throw new Error("please connect wallet");
    }

    setIsSubmitting(true);

    try {
      const {
        startTimestamp: registrationStartTimestamp,
        endTimestamp: registrationEndTimestamp,
      } = getUnixTimestamps(
        data.registrationStartValue,
        data.registrationStartUnit,
        data.registrationEndValue,
        data.registrationEndUnit
      );

      // Calculate allocation timestamps starting from registration end + 1 second
      const allocationStartMs = getMilliseconds(
        data.allocationStartValue,
        data.allocationStartUnit
      );
      const allocationEndMs = getMilliseconds(
        data.allocationEndValue,
        data.allocationEndUnit
      );

      const allocationStartTimestamp =
        registrationEndTimestamp + Math.floor(allocationStartMs / 1000);
      const allocationEndTimestamp =
        allocationStartTimestamp + Math.floor(allocationEndMs / 1000);

      const params = {
        ...data,
        address,
        amount: BigInt(data.amount),
        registrationStartTimestamp,
        registrationEndTimestamp,
        allocationStartTimestamp,
        allocationEndTimestamp,
      };

      await deployTrust(params);

      toast.success("Trust Fund created successfully!");
      form.reset();
    } catch (error) {
      console.error("Error creating trust fund:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create trust fund"
      );
    } finally {
      setOpen(false);
      setIsSubmitting(false);
    }
  };

  const content = (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <FormLabel>General</FormLabel>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="Fund Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2 items-center">
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TokenSelect
                      tokens={tokens}
                      selectedToken={field.value}
                      onSelectToken={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Amount"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="avatarUrl"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Avatar URL (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Description (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <FormLabel className="flex items-center gap-2">
            Registration Time
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>When beneficiaries register</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FormLabel>
          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="registrationStartValue"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      className="w-16"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="registrationStartUnit"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-[110px]">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      <SelectGroup>
                        {["seconds", "minutes", "hours", "days", "weeks"].map(
                          (unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          )
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <span className="text-sm font-medium">from now, it starts</span>
          </div>

          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="registrationEndValue"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      className="w-16"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="registrationEndUnit"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-[110px]">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      <SelectGroup>
                        {["seconds", "minutes", "hours", "days", "weeks"].map(
                          (unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          )
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <span className="text-sm font-medium">later, it ends</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <FormLabel className="flex items-center gap-2">
            Allocation Time
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>When you set beneficiary funds</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FormLabel>
          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="allocationStartValue"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      className="w-16"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allocationStartUnit"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-[110px]">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      <SelectGroup>
                        {["seconds", "minutes", "hours", "days", "weeks"].map(
                          (unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          )
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <span className="text-sm font-medium">
              from registration end, it starts
            </span>
          </div>

          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="allocationEndValue"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      className="w-16"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allocationEndUnit"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-[110px]">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      <SelectGroup>
                        {["seconds", "minutes", "hours", "days", "weeks"].map(
                          (unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          )
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <span className="text-sm font-medium">later, it ends</span>
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating Fund..." : "Create Fund"}
        </Button>
      </form>
    </Form>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="flex justify-end">
          <DialogTrigger asChild>
            <Button>Create New Poll</Button>
          </DialogTrigger>
        </div>
        <DialogContent
          ref={emojiPickerContainerRef}
          className="flex flex-col gap-2 sm:max-w-[425px] bg-white sm:rounded-2xl rounded-2xl"
        >
          <DialogHeader>
            <DialogTitle>Create New Poll</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>Create New Poll</Button>
      </DrawerTrigger>
      <DrawerContent ref={emojiPickerContainerRef}>
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-2xl font-bold text-center mb-6">
            Create New Poll
          </DrawerTitle>
        </DrawerHeader>
        {content}
      </DrawerContent>
    </Drawer>
  );
};

export default NewTrustFund;
