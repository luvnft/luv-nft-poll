"use client";

import { formatDistanceToNow } from "date-fns";
import { ArrowDown, Loader } from "lucide-react";
import Link from "next/link";
import { Abstraxion, useAbstraxionAccount } from "@burnt-labs/abstraxion";
import { useXionProtocol } from "../library/hooks/use-xion-protocol";
import { PredictionMarket, RecentActivity } from "../library/types/prediction-market";

import { Avatar, AvatarFallback, AvatarImage } from "../library/components/atoms/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../library/components/atoms/card";
import NewPoll from "../library/components/organisms/new-poll";
import { useMounted } from "../library/hooks/use-mounted";
import { getInitials, isValidUrl } from "../library/utils";

const Home = () => {
  const { predictionMarkets } = useXionProtocol();
  const { data: account } = useAbstraxionAccount();
  const isMounted = useMounted();

  const { data: markets, isLoading, error } = predictionMarkets;

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error loading markets</div>;

  if (!isMounted) {
    // return null;
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader className="animate-spin text-gray-500 mt-36 mb-4" size={24} />
        <p className="text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-24 flex flex-col overflow-hidden gap-20">
      <div className="flex flex-col gap-6 relative">
        <div className="relative h-[60vh] md:w-[calc(100%+12rem)] md:-ml-24">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/hero.png')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>

          <div className="absolute inset-0 flex flex-col items-start justify-center px-6 md:px-24 text-white">
            <div className="w-full md:w-1/2 gap-6 flex flex-col">
              <h1 className="text-4xl md:text-6xl font-medium font-mouse">
                Predict. Stake. Win – No Loss, All Fun{" "}
              </h1>
              <p className="text-lg md:text-xl font-mono mb-4">
                The first no-loss prediction market with memecoins. Stake XION,
                receive meme tokens, and predict with no risk—powered by memes.{" "}
              </p>
              <NewPoll />
              {/* {isConnected ? (
                <NewPoll />
              ) : (
                // <button
                //   onClick={() => {}}
                //   className="font-medium px-8 py-4 rounded-3xl text-xl flex items-center gap-4 bg-[#33CB82] hover:bg-[#33CB82]/80 transition-colors duration-200"
                // >
                //   Connect Wallet
                // </button>
              )} */}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center mt-8" id="polls">
        <h2 className="text-xl md:text-5xl font-medium mb-8">
          Polls for you
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {markets?.map((market: PredictionMarket) => (
            <Link
              key={market.address}
              href={`/polls/${market.address}`}
            >
              <Card className="overflow-hidden flex flex-col justify-between h-full">
                <CardHeader>
                  <div className="relative">
                    <Avatar>
                      <AvatarImage
                        src={
                          isValidUrl(market?.avatar ?? "")
                            ? market?.avatar
                            : `https://avatar.vercel.sh/${
                                (market?.address ?? "") +
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
                        !market.is_resolved
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {!market.is_resolved ? "active" : "resolved"}
                    </span>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-600 mt-8">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Loader className="w-4 h-4" />
                      <span>
                        Ends {new Date(market.end_timestamp * 1000).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-green-600">
                        {market.total_staked} {market.denom}
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
        <div className="w-2/3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
          </div>

          <div className="space-y-4">
            {markets?.flatMap((market: PredictionMarket) => market.recent_activity)
              .map((item: RecentActivity) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 justify-between"
                >
                  <div className="relative">
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
                          item.choice === "yes"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {item.choice}
                      </span>{" "}
                      {/* {item.amount && `(${item.amount})`} */}
                      at (${item.amount})
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDistanceToNow(item.timestamp * 1000, { addSuffix: true })}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center md:w-[calc(100%+12rem)] md:-ml-24 py-20 bg-slate-200">
        <Link
          href="https://github.com/capypolls"
          target="_blank"
          rel="noopener noreferrer"
          className="border md:text-xl border-[#191A23] font-medium py-5 md:px-9 px-6 rounded-3xl"
        >
          GitHub Repository
        </Link>
      </div>

      <Abstraxion onClose={() => {}} />
    </div>
  );
};

export default Home;
