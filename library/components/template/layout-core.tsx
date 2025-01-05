import { Urbanist, Mouse_Memoirs } from "next/font/google";

import { Toaster } from "@/components/atoms/sonner";
import Header from "@/components/organisms/header";
import RootProvider from "@/providers";
import "@/styles/globals.css";
import { cn } from "@/utils";

const urbanist = Urbanist({ subsets: ["latin"], preload: true });
const mouseMemoirs = Mouse_Memoirs({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mouse-memoirs",
});

const CoreLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(urbanist.className, mouseMemoirs.variable)}>
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

export default CoreLayout;
