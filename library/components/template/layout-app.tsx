"use client";

import { Toaster } from "@/components/atoms/sonner";
import RootProvider from "@/providers";
import Header from "../organisms/header";

const LayoutApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main className="flex w-screen">
        <RootProvider>
          <div className="flex flex-col w-full">
            <Header />
            {children}
          </div>
        </RootProvider>
      </main>
      <Toaster />
    </>
  );
};

export default LayoutApp;
