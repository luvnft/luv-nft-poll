import { getDefaultConfig } from "connectkit";
import { createConfig, http } from "wagmi";
import { anvil, opBNBTestnet } from "wagmi/chains";

const isDev = process.env.NODE_ENV === "development";

export const config = createConfig(
  getDefaultConfig({
    appName: "capypolls",
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
    chains: [opBNBTestnet],
    // chains: isDev ? [anvil] : [opBNBTestnet],
    multiInjectedProviderDiscovery: true,
    transports: {
      [anvil.id]: http(),

      [opBNBTestnet.id]: http(
        "https://opbnb-testnet.g.alchemy.com/v2/wmmPIFmPi700hZkT_QuBCKRvsCpvJ-J9"
      ),
    },
  })
);
