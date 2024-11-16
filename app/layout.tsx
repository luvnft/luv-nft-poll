import type { Metadata } from "next";

import LayoutWrapper from "@/components/template/layout-wrapper";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://capyflows.vercel.app/"),
  title: "CapyFlows",
  icons: "/capyflows-logo.png",
  description: "Onchain trust distribution",
  openGraph: {
    images: "capyflows-og.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}
