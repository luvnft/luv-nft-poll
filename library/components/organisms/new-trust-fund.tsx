"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/atoms/button";
import { Checkbox } from "@/components/atoms/checkbox";
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
import { ScrollArea } from "@/components/atoms/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Separator } from "@/components/atoms/separator";
import EmojiPicker from "@/components/molecules/emoji-picker";
import TokenSelect from "@/components/molecules/select-token";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Token } from "@/types";

type TimeUnit = "minutes" | "hours" | "days" | "weeks";

const tokens: Token[] = [
  {
    symbol: "USDe",
    name: "Ethena USD",
    address:
      "0x05528e1787f89bd1c9ed07dd25df7a0a6abe406fb1228ce44a185256b7162049",
  },
];

const FormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  token: z.any().refine((val) => val !== null, { message: "Token is required" }),
  amount: z.number().min(1, { message: "Amount must be greater than 0" }),
  description: z.string().optional(),
  startValue: z.number().min(1),
  startUnit: z.enum(["minutes", "hours", "days", "weeks"]),
  endValue: z.number().min(1),
  endUnit: z.enum(["minutes", "hours", "days", "weeks"]),
  approvedCollectors: z.array(z.string())
});

const NewTrustFund = () => {
  const [emoji, setEmoji] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const emojiPickerContainerRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      token: null,
      amount: 0,
      description: "",
      startValue: 1,
      startUnit: "hours",
      endValue: 10,
      endUnit: "minutes",
      approvedCollectors: []
    }
  });

  const getMilliseconds = (value: number, unit: TimeUnit) => {
    const multipliers = {
      minutes: 60 * 1000,
      hours: 60 * 60 * 1000,
      days: 24 * 60 * 60 * 1000,
      weeks: 7 * 24 * 60 * 60 * 1000,
    };
    return value * multipliers[unit];
  };

  const getUnixTimestamps = (startValue: number, startUnit: TimeUnit, endValue: number, endUnit: TimeUnit) => {
    const now = Date.now();
    const startOffset = getMilliseconds(startValue, startUnit);
    const endOffset = getMilliseconds(endValue, endUnit);

    const startTimestamp = Math.floor((now + startOffset) / 1000);
    const endTimestamp = Math.floor((now + startOffset + endOffset) / 1000);

    return { startTimestamp, endTimestamp };
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSubmitting(true);

    try {
      const { startTimestamp, endTimestamp } = getUnixTimestamps(
        data.startValue,
        data.startUnit,
        data.endValue,
        data.endUnit
      );

      console.log("Fund Details:", {
        ...data,
        emoji,
        startTimestamp,
        endTimestamp,
      });

      toast.success("Trust Fund created successfully!");
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error creating trust fund:", error);
      toast.error(
        `Failed to create trust fund: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <FormLabel>General</FormLabel>
          <div className="flex space-x-2 items-center">
            <EmojiPicker
              emojiPickerContainerRef={emojiPickerContainerRef}
              setSelectedEmoji={setEmoji}
            />
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
          </div>

          <div className="flex space-x-2">
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem className="flex-1">
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
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
          <FormLabel>Registration Time</FormLabel>
          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="startValue"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      className="w-20"
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
              name="startUnit"
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
                        {["minutes", "hours", "days", "weeks"].map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <span>from now, it starts</span>
          </div>

          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="endValue"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      className="w-20"
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
              name="endUnit"
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
                        {["minutes", "hours", "days", "weeks"].map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <span>later, it ends</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span>
            <h4 className="text-sm font-medium leading-none">Collectors</h4>
            <h6 className="text-xs">
              (optional registered collectors to gate recipients funds to)
            </h6>
          </span>
          <ScrollArea className="h-32 rounded-md border">
            <div className="p-4">
              {tags.map((tag) => (
                <React.Fragment key={tag}>
                  <div className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name="approvedCollectors"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Checkbox
                              checked={field.value.includes(tag)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, tag]);
                                } else {
                                  field.onChange(field.value.filter((value) => value !== tag));
                                }
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <label className="text-sm cursor-pointer">
                      {tag}
                    </label>
                  </div>
                  <Separator className="my-2" />
                </React.Fragment>
              ))}
            </div>
          </ScrollArea>
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
            <Button>New Trust Fund</Button>
          </DialogTrigger>
        </div>
        <DialogContent
          ref={emojiPickerContainerRef}
          className="flex flex-col gap-2 sm:max-w-[425px] bg-white sm:rounded-2xl rounded-2xl"
        >
          <DialogHeader>
            <DialogTitle>Create New Trust Fund</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>New Trust Fund</Button>
      </DrawerTrigger>
      <DrawerContent ref={emojiPickerContainerRef}>
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-2xl font-bold text-center mb-6">
            Create New Trust Fund
          </DrawerTitle>
        </DrawerHeader>
        {content}
      </DrawerContent>
    </Drawer>
  );
};

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);

export default NewTrustFund;
