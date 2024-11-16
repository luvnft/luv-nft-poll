import { getDefaultConfig } from "connectkit";
import { createConfig, http } from "wagmi";
import { anvil } from "wagmi/chains";

export const config = createConfig(
  getDefaultConfig({
    appName: "CapyFlows",
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
    chains: [anvil],
    multiInjectedProviderDiscovery: true,
    transports: {
      [anvil.id]: http(),
    },
  })
);
