"use client";

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
import { useMediaQuery } from "@/hooks/use-media-query";
import { isValidUrl } from "@/utils";
import { Copy, DollarSign } from "lucide-react";
import { Progress } from "../atoms/progress";

interface Beneficiary {
  id: number;
  name: string;
  description: string;
  avatarUrl: string;
  address: `0x{string}`;
  percentage: number;
}

const Beneficiary = ({
  id,
  name,
  description,
  avatarUrl,
  address,
  percentage,
}: Beneficiary) => {
  const [open, setOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const trigger = (
    <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <Image
            src={isValidUrl(avatarUrl) || `https://avatar.vercel.sh/${address}`}
            alt={`${name} logo`}
            width={48}
            height={48}
            className="aspect-[1] rounded-full object-cover"
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{name}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
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
              <p className=" text-4xl font-medium">+2222</p>
              <p className=" text-green-400 text-2xl">USDe</p>
            </div>
            <p className=" text-xs">$2222 USD</p>
          </div>
        </div>

        <div className=" flex gap-2 items-center rounded-full bg-gray-200 py-2 px-4">
          <p>Total Amount</p>
          <div className=" w-2 h-2 rounded-full bg-green-400"></div>
          <p>$3000</p>
        </div>

        <div className=" p-4 bg-gray-200"></div>

        <div className=" rounded-md p-2 flex gap-4 border border-gray-200">
          <div className=" h-5 w-5 bg-black rounded-full"></div>
          <p className="text-sm"> {address}</p>
          <button onClick={() => navigator.clipboard.writeText(address)}>
            <Copy width={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full">
      <Progress value={percentage} />

        {/* Percentage Text */}
        <span className=" text-sm font-semibold">{percentage}%</span>
      </div>
    </div>
    // <Card className="h-full transition-shadow hover:shadow-md">
    //   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    //     <CardTitle className="text-sm font-medium">
    //       <Image
    //         src={isValidUrl(avatarUrl) || `https://avatar.vercel.sh/${address}`}
    //         alt={`${name} logo`}
    //         width={48}
    //         height={48}
    //         className="aspect-[1] rounded-full object-cover"
    //       />
    //     </CardTitle>
    //   </CardHeader>
    //   <CardContent>
    //     <div className="text-2xl font-bold">{name}</div>
    //     <p className="text-xs text-muted-foreground">{description}</p>
    //   </CardContent>
    // </Card>
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

export default Beneficiary;
