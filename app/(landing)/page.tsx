"use client"
import { ArrowDown, ArrowUpRight, Timer, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { AnimatePresence, motion } from "framer-motion";
import { CanvasRevealEffect } from "@/components/atoms/canvas-reveal-effect";

import TrustTriangleExamples from "@/components/organisms/trust-triangle-examples";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

type PredictionMarket = {
  id: string;
  question: string;
  image: string;
  status: "active" | "closed" | "resolved";
  poolSize: number;
  participants: number;
  endDate: string;
  tags: string[];
};

type ActivityItem = {
  id: string;
  question: string;
  user: string;
  action: "staked";
  choice: "Yes" | "No";
  price: number;
  amount: number;
  timestamp: Date;
  teamLogo?: string;
};

type VolumeUser = {
  id: string;
  username: string;
  volume: number;
  rank: number;
};

// Mock Data
const recentActivity: ActivityItem[] = [
  {
    id: "1",
    question: "Will Bitcoin reach $85,000 in December?",
    user: "Marcelo",
    action: "staked",
    choice: "Yes",
    price: 14,
    amount: 77.11,
    timestamp: new Date(),
    teamLogo: "https://picsum.photos/200/200?random=100",
  },
  {
    id: "2",
    question: "Will Celtic win the UEFA Champions League?",
    user: "hYlQDLDfDXFuWhNT",
    action: "staked",
    choice: "No",
    price: 99,
    amount: 48.79,
    timestamp: new Date(),
    teamLogo: "https://picsum.photos/200/200?random=100",
  },
  {
    id: "3",
    question: "Will the Saints win the NFC Championship?",
    user: "AidanAdelynn",
    action: "staked",
    choice: "No",
    price: 100,
    amount: 20.0,
    timestamp: new Date(),
    teamLogo: "https://picsum.photos/200/200?random=100",
  },
];

const topVolume: VolumeUser[] = [
  {
    id: "1",
    username: "MyNameIsJohn",
    volume: 34506062,
    rank: 1,
  },
  {
    id: "2",
    username: "MAGATRUMPDIO2024",
    volume: 33769138,
    rank: 2,
  },
  {
    id: "3",
    username: "testerofshayneplatform",
    volume: 33483376,
    rank: 3,
  },
];

// Fake data
const predictionMarkets: PredictionMarket[] = [
  {
    id: "1",
    question: "Will Bitcoin surpass $100,000 by the end of 2024?",
    image: `https://picsum.photos/200/200?random=1`,
    status: "active",
    poolSize: 450000,
    participants: 1234,
    endDate: "2024-12-31",
    tags: ["Crypto", "Finance"],
  },
  {
    id: "2",
    question:
      "Will SpaceX successfully complete its first Mars landing in 2025?",
    image: `https://picsum.photos/200/200?random=2`,
    status: "active",
    poolSize: 890000,
    participants: 3456,
    endDate: "2025-12-31",
    tags: ["Space", "Technology"],
  },
  {
    id: "3",
    question: "Will the US Federal Reserve cut interest rates in Q3 2024?",
    image: `https://picsum.photos/200/200?random=3`,
    status: "active",
    poolSize: 670000,
    participants: 2789,
    endDate: "2024-09-30",
    tags: ["Economics", "Politics"],
  },
  {
    id: "4",
    question: "Will Ethereum's market cap exceed Bitcoin's by 2025?",
    image: `https://picsum.photos/200/200?random=4`,
    status: "active",
    poolSize: 530000,
    participants: 1890,
    endDate: "2025-12-31",
    tags: ["Crypto", "Blockchain"],
  },
  {
    id: "5",
    question: "Will AI-generated art win a prestigious global award by 2026?",
    image: `https://picsum.photos/200/200?random=5`,
    status: "active",
    poolSize: 310000,
    participants: 940,
    endDate: "2026-12-31",
    tags: ["AI", "Art"],
  },
  {
    id: "6",
    question: "Will a new record temperature be set globally in 2024?",
    image: `https://picsum.photos/200/200?random=6`,
    status: "active",
    poolSize: 770000,
    participants: 2050,
    endDate: "2024-12-31",
    tags: ["Climate", "Environment"],
  },
  {
    id: "7",
    question: "Will Tesla's Cybertruck deliveries surpass 100,000 in 2024?",
    image: `https://picsum.photos/200/200?random=7`,
    status: "active",
    poolSize: 480000,
    participants: 1345,
    endDate: "2024-12-31",
    tags: ["Technology", "Automotive"],
  },
  {
    id: "8",
    question: "Will the next iPhone feature a foldable screen by 2025?",
    image: `https://picsum.photos/200/200?random=8`,
    status: "active",
    poolSize: 640000,
    participants: 2760,
    endDate: "2025-09-30",
    tags: ["Technology", "Gadgets"],
  },
  {
    id: "9",
    question: "Will a new vaccine for Alzheimer's disease be approved by 2026?",
    image: `https://picsum.photos/200/200?random=9`,
    status: "active",
    poolSize: 920000,
    participants: 3120,
    endDate: "2026-12-31",
    tags: ["Health", "Medicine"],
  },
  {
    id: "10",
    question:
      "Will a major movie studio release a fully AI-generated blockbuster by 2025?",
    image: `https://picsum.photos/200/200?random=10`,
    status: "active",
    poolSize: 580000,
    participants: 1900,
    endDate: "2025-12-31",
    tags: ["AI", "Entertainment"],
  },
  {
    id: "11",
    question:
      "Will a human reach the bottom of the Mariana Trench again by 2025?",
    image: `https://picsum.photos/200/200?random=11`,
    status: "active",
    poolSize: 730000,
    participants: 2500,
    endDate: "2025-12-31",
    tags: ["Exploration", "Science"],
  },
  {
    id: "12",
    question: "Will India become the third-largest economy by 2027?",
    image: `https://picsum.photos/200/200?random=12`,
    status: "active",
    poolSize: 810000,
    participants: 3020,
    endDate: "2027-12-31",
    tags: ["Economics", "Global"],
  },
];

const Home = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className=" pt-8 px-4 md:px-24 flex flex-col  overflow-hidden gap-20">
      {/* hero section */}
      <div className=" flex flex-col gap-[30px] relative ">
        <header className=" flex justify-between items-center">
          <div className=" flex items-end gap-2">
            <Image
              alt="capyflows logo"
              src="/capyflows-logo.png"
              width={45}
              height={45}
            />
            <Image
              alt="capyflows logo"
              src="/CapyFlows.svg"
              width={138}
              height={40}
              className="hidden md:block"
            />
          </div>
          <Link href="/trust">
            <button className="border md:text-lg border-[#191A23] font-medium py-4 md:px-6 px-4 rounded-3xl">
              Launch App
            </button>
          </Link>
        </header>
        {/* <div className="absolute inset-0  h-[400px] w-[400px] bg-green-400 opacity-70  -z-10 top-[150px] blur-[200px] left-[100px] rounded-full" /> */}

        <div className="relative h-[60vh] md:w-[calc(100%+12rem)] md:-ml-24 ">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/hero.png')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50  to-transparent"></div>

          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col items-start justify-center px-6 md:px-24 text-white">
            <div className="w-full md:w-1/2 gap-4 flex flex-col ">
              <h1 className="text-4xl md:text-6xl font-medium font-mouse">
                Bet on yourself
              </h1>
              <p className="text-lg md:text-xl font-mono mb-4">
                Decentralized prediction markets for fearless degenerates.
                Create, trade, and win on the wildest crypto events.
              </p>
              <Link href="/trust">
                <button className="font-medium px-8 py-4 rounded-3xl text-xl flex items-center gap-4 bg-[#33CB82] hover:bg-[#33CB82]/80 transition-colors duration-200">
                  Explore Now
                  <div className="w-10 h-10 rounded-full bg-[#191A23] flex justify-center items-center">
                    <ArrowDown strokeWidth={3} className="text-emerald-400" />
                  </div>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* polls for you  */}
      <div className=" flex flex-col items-center mt-8">
        <h2 className=" text-xl md:text-5xl font-medium mb-8 ">
          Polls for you
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {predictionMarkets.map((market) => (
            <Card key={market.id} className="overflow-hidden">
              {/* Image Section */}

              <CardHeader>
                <div className="relative ">
                  <Image
                    src={market.image}
                    alt={market.question}
                    width={50}
                    height={50}
                    className=" rounded-full"
                  />
                </div>
                {/* Question */}
                <CardTitle className="text-lg font-medium">
                  {market.question}
                </CardTitle>

                {/* Status and Tags */}
                <div className="flex gap-2 mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      market.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {market.status}
                  </span>
                  {market.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-600 mt-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>
                      {market.participants.toLocaleString()} participants
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-green-600">
                      ${market.poolSize.toLocaleString()}
                    </span>
                    <span>pool</span>
                  </div>
                </div>

                {/* Time Remaining */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-4">
                  <Timer className="w-4 h-4" />
                  <span>
                    Ends {new Date(market.endDate).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <button className="font-medium px-8 py-4 rounded-3xl text-xl flex items-center gap-4 bg-[#33CB82] hover:bg-[#33CB82]/80 transition-colors duration-200 mt-10">
          Show more
          <div className="w-10 h-10 rounded-full bg-[#191A23] flex justify-center items-center">
            <ArrowDown strokeWidth={3} className="text-emerald-400" />
          </div>
        </button>
      </div>

        {/* <h2 className=" text-xl md:text-5xl font-medium mb-8 ">
          Polls for you
        </h2> */}

        <div className="flex items-center justify-center">
          {/* Recent Activity Section */}
          <div className=" w-2/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
             
            </div>

            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center gap-3 justify-between">
                  <img
                    src={item.teamLogo}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="text-sm mb-1">{item.question}</div>
                    <div className="text-sm">
                      <span className="font-medium">{item.user}</span>{" "}
                      {item.action}{" "}
                      <span
                        className={
                          item.choice === "Yes"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {item.choice}
                      </span>{" "}
                      at (${item.amount})
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                  </div>
                </div>
              ))}
            </div>
          </div>


        </div>



      <div className=" flex items-center justify-center md:w-[calc(100%+12rem)] md:-ml-24 py-20 bg-slate-200 ">
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
