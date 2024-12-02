import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { isValidUrl } from "@/utils";

interface FundLink {
  strategyAddress: string;
  name: string;
  description: string;
  avatarUrl: string;
}

const FundLink = ({ strategyAddress, name, description, avatarUrl }: FundLink) => (
  <Link href={`/trust/${strategyAddress}`}>
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <Image
            src={isValidUrl(avatarUrl) || `https://avatar.vercel.sh/${strategyAddress}`}
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
  </Link>
);

export default FundLink;
