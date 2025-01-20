"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

import ConnectKitProvider from "./connectkit";
import { ThemeProvider } from "./theme";
import WagmiProvider from "./wagmi";
import { XionProvider } from "./xion/provider";

const queryClient = new QueryClient();

const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {/* <WagmiProvider> */}
        <XionProvider>
          <QueryClientProvider client={queryClient}>
            {/* <ConnectKitProvider></ConnectKitProvider> */}
            {children}
          </QueryClientProvider>
        </XionProvider>
      {/* </WagmiProvider> */}
    </ThemeProvider>
  );
};

export default RootProvider;
