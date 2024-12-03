"use client";
import Image from "next/image";
import React from "react";
import { Card, Carousel } from "../molecules/apple-cards-carousel";

export function AppleCardsCarouselDemo() {
  const cards = data.map((card, index) => (
    <Card key={index} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-6xl font-medium ">
        An Onchain trust triangle example
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

const DummyContent = () => {
  return (
    <>
      {[...new Array(3).fill(1)].map((_, index) => {
        return (
          <div
            key={"dummy-content" + index}
            className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
          >
            <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                The first rule of Apple club is that you boast about Apple club.
              </span>{" "}
              Keep a journal, quickly jot down a grocery list, and take amazing
              class notes. Want to convert those notes to text? No problem.
              Langotiya jeetu ka mara hua yaar is ready to capture every
              thought.
            </p>
            <Image
              src="https://assets.aceternity.com/macbook.png"
              alt="Macbook mockup from Aceternity UI"
              height="500"
              width="500"
              className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
            />
          </div>
        );
      })}
    </>
  );
};

const data = [
  {
    category: "Business",
    title:
      "Business grants where donors fund entrepreneurs, and business mentors get compensated for guidance",
    arrow: "#33CB82",
    content: <DummyContent />,
    bg: "bg-black",
  },
  {
    category: "Education",
    title:
      "Education funds where donors support students, and approved tutors/schools can provide services",
    arrow: "#FFDF52",
    opacity: 0.6,
    bg: "bg-emerald-400",
    content: <DummyContent />,
  },
  {
    category: "Health",
    title:
      "A medical fund where donors contribute, beneficiaries get treatment, and pre-approved healthcare providers get paid directly",
    arrow: "#000000",
    opacity: 0.2,
    bg: "bg-yellow-300",
    content: <DummyContent />,
  },
  {
    category: "Disaster Relief",
    title:
      "Donors contribute to relief efforts, pre-approved aid organizations receive funds, and beneficiaries receive support.",
    arrow: "#FF5733", // Vibrant coral red
    opacity: 0.6,
    bg: "bg-purple-700", // A bold purple for contrast and urgency
    content: <DummyContent />,
  },
  {
    category: "Environmental Conservation",
    title:
      "Donors support reforestation efforts, approved tree-planting organizations receive funds, and satellite imaging verifies the progress.",
    arrow: "#79fdd1", // Soft teal for a refreshing nature vibe
    opacity: 0.5,
    bg: "bg-teal-500", // A vibrant teal-green reflecting nature
    content: <DummyContent />,
  },
  {
    category: "Real Estate Crowdfunding",
    title:
      "Investors fund property development, contractors complete projects, and property managers receive payment for maintenance.",
    arrow: "#8B572A", // Rich warm brown to symbolize earth/structure
    opacity: 0.4,
    bg: "bg-yellow-400", // Bright orange for a welcoming tone
    content: <DummyContent />,
  },
];
