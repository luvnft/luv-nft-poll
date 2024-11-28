import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import Emoji from "@/components/atoms/emoji";

interface FundLink {
  id: number;
  name: string;
  description: string;
  emojiCodePoint: string;
}

const FundLink = ({ id, name, description, emojiCodePoint }: FundLink) => (
  <Link href={`/trust/${id}`}>
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <Emoji
            emoji={emojiCodePoint}
            className="inline-block text-4xl !no-underline"
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
