import { formatDistanceToNow } from "date-fns";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Strategy } from "@/hooks/use-fund-data";
import { ellipsisAddress } from "@/utils";
import { Separator } from "../atoms/separator";

const FundStats = ({ data }: { data?: Strategy }) => {
  if (!data) {
    return null;
  }

  return (
    <div className="">
      <Card className=" flex">
        <div className=" w-1/2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Trust Contract
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ellipsisAddress(data.strategyAddress)}
            </div>
            <p className="text-xs text-muted-foreground">
              Deployed{" "}
              {formatDistanceToNow(new Date(data.blockTimestamp * 1000), {
                addSuffix: true,
              })}
            </p>
          </CardContent>
        </div>

        <div className=" w-1 flex items-center">
          <Separator orientation="vertical" className=" h-3/4" />
        </div>

        <div className=" w-1/2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pool Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-2xl font-bold">
              {Number(data.poolSize).toFixed(3)}&nbsp;
              <span className="text-lg font-medium">sUSDe</span>
            </div>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </div>
      </Card>
      {/* <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pool Size</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-2xl font-bold">{Number(data.poolSize).toFixed(3)}&nbsp;<span className="text-lg font-medium">sUSDe</span></div>
          <p className="text-xs text-muted-foreground">+0% from last month</p>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default FundStats;
