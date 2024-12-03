import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { DashboardStats } from "@/hooks/use-trust-data";

const TrustStats = ({
  totalDistributed,
  ongoingStreams,
  activeBeneficiaries,
}: DashboardStats) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Distributed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalDistributed.toString()}</div>
        <p className="text-xs text-muted-foreground">+0% from last month</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Ongoing Streams</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{ongoingStreams}</div>
        <p className="text-xs text-muted-foreground">+0% from last month</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Active Beneficiaries
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{activeBeneficiaries}</div>
        <p className="text-xs text-muted-foreground">+0 since last week</p>
      </CardContent>
    </Card>
  </div>
);

export default TrustStats;
