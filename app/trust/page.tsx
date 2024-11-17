import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/tabs";
import FundLink from "@/components/molecules/link-fund";
import NewTrust from "@/components/organisms/new-trust-fund";

const Trust = () => {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Trust Dashboard</h2>

      <Tabs defaultValue="overview" className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trusts">Trusts</TabsTrigger>
            <TabsTrigger value="notifications" disabled>
              Notifications
            </TabsTrigger>
            <TabsTrigger value="settings" disabled>
              Settings
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            <NewTrust />
          </div>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Overview</h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Distributed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ongoing Streams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">350</div>
                <p className="text-xs text-muted-foreground">
                  0% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Beneficiaries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">573</div>
                <p className="text-xs text-muted-foreground">
                  +201 since last week
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 min-h-[100vh] md:min-h-min">
              <CardHeader>
                <CardTitle>Funding Summary</CardTitle>
              </CardHeader>
              <CardContent>something here</CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Actions</CardTitle>
                <CardDescription>
                  You took 265 actions this month.
                </CardDescription>
              </CardHeader>
              <CardContent>something here</CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trusts" className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Trust Funds</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <FundLink
              id={0}
              name={"Don't know"}
              description={"Happy "}
              emojiCodePoint={"1F600"}
            />
            <FundLink
              id={1}
              name={"Ethena Foundation"}
              description={"Happy Men"}
              emojiCodePoint={"1F601"}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Trust;
