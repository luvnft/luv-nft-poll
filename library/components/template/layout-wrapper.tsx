"use client";

import { Inter } from "next/font/google";

import { Toaster } from "@/components/atoms/sonner";
import RootProvider from "@/providers";
import { cn } from "@/utils";
import Header from "../organisms/header";

const inter = Inter({ subsets: ["latin"], preload: true });

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className)}>
        <main className="flex w-screen">
          <RootProvider>
            <div className="flex flex-col w-full">
              <Header />
              {children}
            </div>
          </RootProvider>
        </main>
        <Toaster />
      </body>
    </html>
  );
};

export default LayoutWrapper;
