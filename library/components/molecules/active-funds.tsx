import React from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/atoms/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Separator } from "@/components/atoms/separator";
import { isValidUrl } from "@/utils";
import { getInitials } from "@/utils";
import { TrustFund } from "@/hooks/use-trust-data";

const ActiveFunds = ({ data }: { data: TrustFund[] }) => (
  <Card className="col-span-4 min-h-[100vh] md:min-h-min">
    <CardHeader>
      <CardTitle>Active Trust Funds</CardTitle>
      <CardDescription>
        Your 5 most recent active fundings.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex gap-3 flex-col">
        {data.slice(0, 5).map((item, index, array) => (
          <React.Fragment key={index}>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage
                  src={
                    isValidUrl(item.avatar) ||
                    `https://avatar.vercel.sh/${
                      item.strategyAddress + item.name
                    }`
                  }
                  alt={`${name} logo`}
                />
                <AvatarFallback>{getInitials(item.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p>{item.name}</p>
                <p className="text-gray-500 text-sm">
                  {item.description.split(" ").slice(0, 12).join(" ")}
                  {item.description.split(" ").length > 12 ? "..." : ""}
                </p>
              </div>
            </div>
            {index < array.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default ActiveFunds;
