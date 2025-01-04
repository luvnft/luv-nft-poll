import type { Metadata } from "next";

import CoreLayout from "@/components/template/layout-core";

export const metadata: Metadata = {
  metadataBase: new URL("https://capypolls.vercel.app/"),
  title: "CapyPolls",
  icons: "/capypolls-logo.png",
  description: "No loss staking with memecoins",
  openGraph: {
    images: "capypolls-og.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CoreLayout>{children}</CoreLayout>;
}
