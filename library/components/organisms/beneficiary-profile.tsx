"use client";

import { Copy, DollarSign } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
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
import { Progress } from "@/components/atoms/progress";
import { Beneficiary } from "@/hooks/use-fund-data";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ellipsisAddress, isValidUrl } from "@/utils";

const BeneficiaryProfile = ({ data }: { data: Beneficiary }) => {
  const [open, setOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const trigger = (
    <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <Image
            src={
              isValidUrl(data.avatar) ||
              `https://avatar.vercel.sh/${data.address}`
            }
            alt={`${name} logo`}
            width={48}
            height={48}
            className="aspect-[1] rounded-full object-cover"
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{data.name}</div>
        <p className="text-xs text-muted-foreground">{data.bio}</p>
      </CardContent>
    </Card>
  );

  const content = (
    <div className=" p-5 flex flex-col gap-12">
      <div className=" flex flex-col gap-8 items-center">
        <div className=" flex flex-col gap-2 items-center">
          <p className=" text-sm">Total Streamed</p>
          <div className=" flex flex-col items-center">
            <div className=" flex gap-2 items-center">
              <DollarSign />
              <p className=" text-4xl font-medium">
                {data.allocation - data.streamProgress.remaining}
              </p>
              <p className=" text-green-400 text-2xl">USDe</p>
            </div>
            {/* TODO: convert sUSDe to usd */}
            <p className=" text-xs">$ ${data.allocation} USD</p>
          </div>
        </div>

        <div className=" flex gap-2 items-center rounded-full bg-gray-200 py-2 px-4">
          <p>Total Amount</p>
          <div className=" w-2 h-2 rounded-full bg-green-400"></div>
          {/* TODO: convert sUSDe to usd */}
          <p>${data.allocation}</p>
        </div>

        <div className=" p-4 bg-gray-200"></div>

        <div className=" rounded-md p-2 flex gap-4 border border-gray-200 items-center">
          <div className=" h-5 w-5 bg-black rounded-full"></div>
          <p className="text-sm"> {ellipsisAddress(data.address, 10)}</p>
          <button onClick={() => navigator.clipboard.writeText(data.address)}>
            <Copy width={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full">
        <Progress value={data.streamProgress.percentage} />
        <span className=" text-sm font-semibold">
          {data.streamProgress.percentage}%
        </span>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="flex justify-end">
          <DialogTrigger asChild>{trigger}</DialogTrigger>
        </div>
        <DialogContent className="sm:max-w-[425px] bg-white sm:rounded-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle>Beneficiary</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-2xl font-bold text-center mb-6">
            Beneficiary
          </DrawerTitle>
        </DrawerHeader>
        {content}
      </DrawerContent>
    </Drawer>
  );
};

export default BeneficiaryProfile;
