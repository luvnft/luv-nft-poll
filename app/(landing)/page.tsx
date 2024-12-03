import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import TrustTriangleExamples from "@/components/organisms/trust-triangle-examples";

const Home = () => {
  return (
    <div className=" py-10 px-4 md:px-24 flex flex-col gap-24">
      {/* hero section */}
      <div className=" flex flex-col gap-[70px]">
        <header className=" flex justify-between items-center">
          <div className=" flex items-end">
            <Image
              alt="capyflows logo"
              src="/capyflows-logo.png"
              width={60}
              height={60}
            />
            <Image
              alt="capyflows logo"
              src="/CapyFlows.svg"
              width={188}
              height={40}
              className="hidden md:block"
            />
          </div>
          <Link href="/trust">
            <button className="border md:text-xl border-[#191A23] font-medium py-5 md:px-9 px-6 rounded-3xl">
              Launch App
            </button>
          </Link>
        </header>

        <div className="flex flex-col md:flex-row  justify-between gap-10">
          <div className="md:w-1/2 order-1 md:order-2">
            <Image
              src="/hero-image.svg"
              alt="On-chain token distribution"
              width={600}
              height={540}
            />
          </div>
          <div className="md:w-1/2 order-2 md:order-1 text-left lg:w-[550px] flex flex-col gap-9 items-start">
            <h1 className="text-6xl font-medium">
              On-chain token distribution
            </h1>
            <p className=" text-xl ">
              You&apos;re not just moving money - you&apos;re building trust
              networks that connect those who want to help, those who need help,
              and those who can provide specialized support.
            </p>
            <Link href="/trust">
              <button className=" font-medium p-5 rounded-3xl text-xl gap-20 flex items-center bg-[#33CB82] hover:bg-[#33CB82]/80 transition-colors duration-200 ">
                Launch
                <div className="w-10 h-10 rounded-full bg-[#191A23] flex justify-center items-center">
                  <ArrowUpRight
                    strokeWidth={3}
                    className=" text-emerald-400 "
                  />
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* problem section */}
      <div className="min-h-screen flex flex-col md:flex-row border-y mx-[-16px] md:mx-[-96px] px-4 md:px-24 py-4 ">
        {/* Problem Statement */}
        <div className=" md:sticky md:top-20 md:pt-40 md:h-screen md:w-1/2 ">
          <h1 className="text-3xl md:text-6xl font-medium">
            Problem <br className="hidden md:block"></br> Statement
          </h1>
        </div>

        {/* Solution Content */}
        <div className=" md:p-12 py-5 md:w-1/2 flex flex-col gap-8 md:gap-20 md:my-[-16px] md:border-l">
          <div className="">
            {[
              "Traditional donations often feel disconnected - donors give and hope for the best",
              "Beneficiaries sometimes need more than just money - they need guidance or services",
              "Service providers (Collectors) want to help but need sustainable ways to do so",
            ].map((p, idx) => (
              <p key={idx} className=" text-xl md:text-4xl mb-8 md:mb-20 ">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>

      <TrustTriangleExamples />

      <div className=" flex items-center justify-center">
        <Link
          href="https://github.com/kelvinpraises/capyflow"
          target="_blank"
          rel="noopener noreferrer"
          className=" border md:text-xl border-[#191A23] font-medium py-5 md:px-9 px-6 rounded-3xl"
        >
          GitHub Repository
        </Link>
      </div>
    </div>
  );
};

export default Home;
