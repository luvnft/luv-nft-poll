"use client";

import { formatDistanceToNow } from "date-fns";
import { ArrowDown, Loader, Timer } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import NewPoll from "@/components/organisms/new-poll";
import useCapyProtocol from "@/hooks/use-capy-protocol-new";
import { useMounted } from "@/hooks/use-mounted";
import { getInitials, isValidUrl } from "@/utils";

type ActivityItem = {
  id: string;
  question: string;
  user: string;
  action: "staked";
  choice: "Yes" | "No";
  price: number;
  amount: number;
  timestamp: Date;
  avatar?: string;
};

const Home = () => {
  const { predictionMarkets } = useCapyProtocol();
  const isMounted = useMounted();

  if (!isMounted) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader className="animate-spin text-gray-500 mt-36 mb-4" size={24} />
        <p className="text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-24 flex flex-col  overflow-hidden gap-20">
      <div className=" flex flex-col gap-6 relative ">
        <div className="relative h-[60vh] md:w-[calc(100%+12rem)] md:-ml-24 ">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/hero.png')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50  to-transparent"></div>

          <div className="absolute inset-0 flex flex-col items-start justify-center px-6 md:px-24 text-white">
            <div className="w-full md:w-1/2 gap-6 flex flex-col ">
              <h1 className="text-4xl md:text-6xl font-medium font-mouse">
                Predict. Stake. Win – No Loss, All Fun{" "}
              </h1>
              <p className="text-lg md:text-xl font-mono mb-4">
                The first no-loss prediction market with memecoins. Stake usde,
                receive meme tokens, and predict with no risk—powered by memes.{" "}
              </p>
              <NewPoll />
            </div>
          </div>
        </div>
      </div>

      <div className=" flex flex-col items-center mt-8" id="polls">
        <h2 className=" text-xl md:text-5xl font-medium mb-8 ">
          Polls for you
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {predictionMarkets.data?.map((market) => (
            <Link
              key={market.pollAddress}
              href={`/polls/${market.pollAddress}`}
            >
              <Card className="overflow-hidden flex flex-col justify-between h-full">
                <CardHeader>
                  <div className="relative ">
                    <Avatar>
                      <AvatarImage
                        src={
                          isValidUrl(market?.avatar ?? "")
                            ? market?.avatar
                            : `https://avatar.vercel.sh/${
                                (market?.pollAddress ?? "") +
                                (market?.question ?? "")
                              }`
                        }
                        alt={`${market?.question ?? "Poll"} logo`}
                      />
                      <AvatarFallback>
                        {getInitials(market?.question ?? "")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-lg font-medium">
                    {market.question}
                  </CardTitle>

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
                  <div className="flex items-center justify-between text-sm text-gray-600 mt-8">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Timer className="w-4 h-4" />
                      <span>
                        Ends {new Date(market.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-green-600">
                        ${market.poolSize.toLocaleString()}
                      </span>
                      <span>pool</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <button className="font-medium px-8 py-4 rounded-3xl text-xl flex items-center gap-4 bg-[#33CB82] hover:bg-[#33CB82]/80 transition-colors duration-200 mt-10">
          Show more
          <div className="w-10 h-10 rounded-full bg-[#191A23] flex justify-center items-center">
            <ArrowDown strokeWidth={3} className="text-emerald-400" />
          </div>
        </button>
      </div>

      <div className="flex items-center justify-center">
        <div className=" w-2/3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
          </div>

          <div className="space-y-4">
            {predictionMarkets.data
              ?.flatMap((market) => market.recentActivity)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 justify-between"
                >
                  <div className="relative ">
                    <Avatar>
                      <AvatarImage
                        src={
                          isValidUrl(item.avatar ?? "")
                            ? item.avatar
                            : `https://avatar.vercel.sh/${item?.id ?? ""}`
                        }
                        alt={`${item.question ?? "Poll"} logo`}
                      />
                      <AvatarFallback>
                        {getInitials(item.user ?? "")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
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
          href="https://github.com/capypolls"
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
