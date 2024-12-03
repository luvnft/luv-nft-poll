import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { getInitials, isValidUrl } from "@/utils";

interface FundLink {
  strategyAddress: string;
  name: string;
  description: string;
  avatarUrl: string;
}

const FundLink = ({
  strategyAddress,
  name,
  description,
  avatarUrl,
}: FundLink) => (
  <Link href={`/trust/${strategyAddress}`}>
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <Avatar>
            <AvatarImage
              src={
                isValidUrl(avatarUrl) ||
                `https://avatar.vercel.sh/${strategyAddress + name}`
              }
              alt={`${name} logo`}
            />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{name}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  </Link>
);

export default FundLink;
