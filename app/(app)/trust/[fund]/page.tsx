import {
  Card,
  CardContent,
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
import Beneficiary from "@/components/organisms/beneficiary";
import NewTrustFundRegistration from "@/components/organisms/new-trust-fund-registration";

const Fund = () => {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Sample Trust</h2>

      <Tabs defaultValue="overview" className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="notifications" disabled>
              Notifications
            </TabsTrigger>
            <TabsTrigger value="settings" disabled>
              Settings
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            <NewTrustFundRegistration />
          </div>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Overview</h2>
            <p>This is a sample trust fund.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Trust Contract
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0xcaa5...9f0aa</div>
                <p className="text-xs text-muted-foreground">
                  Deployed a month ago
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pool Size</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,350 USDe</div>
                <p className="text-xs text-muted-foreground">
                  +0% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <h3 className="text-lg font-bold tracking-tight">Beneficiaries</h3>

          <div className="col-span-5 grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Beneficiary
              id={0}
              name={"Don't know"}
              description={"Happy "}
              avatarUrl={""}
              address={"0x{string}"}
            />
            <Beneficiary
              id={1}
              name={"Ethena Foundation"}
              description={"Happy Men"}
              avatarUrl={""}
              address={"0x{string}"}
            />
          </div>
        </TabsContent>

        <TabsContent value="trusts" className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Trusts</h2>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Fund;
