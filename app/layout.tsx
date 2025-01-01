import type { Metadata } from "next";

import CoreLayout from "@/components/template/layout-core";

export const metadata: Metadata = {
  metadataBase: new URL("https://capyflows.vercel.app/"),
  title: "CapyPolls",
  icons: "/capyflows-logo.png",
  // description: "Onchain trust distribution",
  openGraph: {
    images: "capyflows-og.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CoreLayout>{children}</CoreLayout>;
}
