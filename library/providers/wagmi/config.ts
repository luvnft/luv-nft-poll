import { getDefaultConfig } from "connectkit";
import { createConfig, http } from "wagmi";
import { anvil, sepolia } from "wagmi/chains";

const isDev = process.env.NODE_ENV === 'development';

export const config = createConfig(
  getDefaultConfig({
    appName: "capypolls",
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
    chains: isDev ? [anvil] : [sepolia],
    multiInjectedProviderDiscovery: true,
    transports: {
      [anvil.id]: http(),
      [sepolia.id]: http("https://eth-sepolia.g.alchemy.com/v2/vEVKURyIJBdxxahH6eQJOSpjtIe3kA6-"),
    },
  })
);
