"use client";

import useCapyProtocol from "@/hooks/use-capy-protocol";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import { useMediaQuery } from "@/hooks/use-media-query";
import { useAccount } from "wagmi";
import { Label } from "@/components/atoms/label";
import { Textarea } from "@/components/atoms/text-area";
import { Plus } from "lucide-react";

const FormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  avatarUrl: z.string().optional(),
  bio: z
    .string()
    .min(10, {
      message: "Bio must be at least 10 characters.",
    })
    .max(160, {
      message: "Bio must not be longer than 160 characters.",
    }),
});

const TrustFundApplication = ({ poolId }: { poolId: bigint }) => {
  const { registerRecipient } = useCapyProtocol();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { address } = useAccount();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      avatarUrl: "",
      bio: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!address) {
      throw new Error("please connect wallet");
    }

    setIsSubmitting(true);

    try {
      await registerRecipient({
        poolId: poolId,
        data: {
          recipientAddress: address,
          name: data.name,
          avatarUrl: data.avatarUrl,
          bio: data.bio,
        },
      });

      toast.success("Trust fund application successful!");

      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error applying to trust fund:", error);
      toast.error(
        `Application failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label>General</Label>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    {...field}
                    className="min-h-[200px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-zinc-800 text-white hover:bg-zinc-700 rounded-lg py-3"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Applying to Trust Fund..." : "Submit Form"}
        </Button>
      </form>
    </Form>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="flex justify-end">
          <DialogTrigger asChild>
          <button className="bg-[#33CB82] hover:bg-[#33CB82]/80 rounded-[14px] h-[50px] px-4 flex items-center gap-5">
          Apply to Trust
          <div className="w-7 h-7 rounded-full bg-[#191A23] flex justify-center items-center">
            <Plus strokeWidth={3} width={16} className=" text-green-500 " />
          </div>
        </button>
            {/* <Button></Button> */}
          </DialogTrigger>
        </div>
        <DialogContent className="flex flex-col gap-2 sm:max-w-[425px] bg-white sm:rounded-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle>Trust Fund Application</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>Apply to Trust</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-2xl font-bold text-center mb-6">
            Trust Fund Application
          </DrawerTitle>
        </DrawerHeader>
        {content}
      </DrawerContent>
    </Drawer>
  );
};

export default TrustFundApplication;
