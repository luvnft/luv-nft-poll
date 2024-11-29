import type { Metadata } from "next";
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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
