import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { XionProvider } from "../../app/library/providers/xion/provider";
//import "./globals.css";

import CoreLayout from "@/components/template/layout-core";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "CapyPolls - No Loss Prediction Markets",
//   description: "The first no-loss prediction market with memecoins",
// };

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
  // return (
  //   <html lang="en">
  //     <body className={inter.className}>
  //       <XionProvider>{children}</XionProvider>
  //     </body>
  //   </html>
  // );
  return <CoreLayout>{children}</CoreLayout>;
}
