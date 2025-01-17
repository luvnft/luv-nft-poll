"use client";

import { AbstraxionProvider } from "@burnt-labs/abstraxion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const queryClient = new QueryClient();

interface XionProviderProps {
  children: ReactNode;
}

const treasuryConfig = {
  treasury: "xion1qt2s536y5t3ftpt6z4d4ym0pug0lmcaaetcwjs74z6kvzfy9tekq7yqqhg", // Example XION treasury instance for executing seat contract
  gasPrice: "0uxion",

  // rpcUrl: "https://rpc.xion-mainnet-1.burnt.com:443",
  // restUrl: "https://api.xion-mainnet-1.burnt.com:443",
};
  
export const XionProvider = ({ children }: XionProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AbstraxionProvider config={treasuryConfig}>
        {children}
      </AbstraxionProvider>
    </QueryClientProvider>
  );
}; 