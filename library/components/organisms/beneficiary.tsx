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

interface Beneficiary {
  id: number;
  name: string;
  description: string;
  avatarUrl: string;
  address: `0x{string}`;
}

const Beneficiary = ({
  id,
  name,
  description,
  avatarUrl,
  address,
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
    <Card className="h-full transition-shadow hover:shadow-md">
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
