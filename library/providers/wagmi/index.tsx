import React from "react";
import { WagmiProvider as _WagmiProvider } from "wagmi";
import { config } from "./config";

const WagmiProvider = ({ children }: { children: React.ReactNode }) => {
  return <_WagmiProvider config={config}>{children}</_WagmiProvider>;
};

export default WagmiProvider;
