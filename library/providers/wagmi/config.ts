import { getDefaultConfig } from "connectkit";
import { createConfig, http } from "wagmi";
import { opBNBTestnet } from "wagmi/chains";

export const config = createConfig(
  getDefaultConfig({
    appName: "capypolls",
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
    chains: [opBNBTestnet] as const,
    multiInjectedProviderDiscovery: true,
    transports: {
      [opBNBTestnet.id]: http(
        "https://opbnb-testnet.g.alchemy.com/v2/wmmPIFmPi700hZkT_QuBCKRvsCpvJ-J9"
      ),
    },
  })
);
