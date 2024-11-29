import { Urbanist } from "next/font/google";

import "@/styles/globals.css";
import { cn } from "@/utils";

const urbanist = Urbanist({ subsets: ["latin"], preload: true });

const CoreLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(urbanist.className)}>{children}</body>
    </html>
  );
};

export default CoreLayout;
