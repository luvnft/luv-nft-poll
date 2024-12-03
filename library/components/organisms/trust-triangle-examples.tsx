"use client";

import { Card, Carousel } from "@/components/molecules/cards-carousel";

const data = [
  {
    category: "Business",
    title:
      "Business grants where donors fund entrepreneurs, and business mentors get compensated for guidance",
    arrow: "#33CB82",
    bg: "bg-black",
  },
  {
    category: "Education",
    title:
      "Education funds where donors support students, and approved tutors/schools can provide services",
    arrow: "#FFDF52",
    opacity: 0.6,
    bg: "bg-emerald-400",
  },
  {
    category: "Health",
    title:
      "A medical fund where donors contribute, beneficiaries get treatment, and pre-approved healthcare providers get paid directly",
    arrow: "#000000",
    opacity: 0.2,
    bg: "bg-yellow-300",
  },
  {
    category: "Disaster Relief",
    title:
      "Donors contribute to relief efforts, pre-approved aid organizations receive funds, and beneficiaries receive support.",
    arrow: "#facc15",
    opacity: 0.8,
    bg: "bg-slate-500",
  },
  {
    category: "Environmental Conservation",
    title:
      "Donors support reforestation efforts, approved tree-planting organizations receive funds, and satellite imaging verifies the progress.",
    arrow: "#8cf1d0",
    opacity: 0.5,
    bg: "bg-teal-600",
  },
  {
    category: "Real Estate Crowdfunding",
    title:
      "Investors fund property development, contractors complete projects, and property managers receive payment for maintenance.",
    arrow: "#36ba09",
    opacity: 0.3,
    bg: "bg-amber-300",
  },
];

const TrustTriangleExamples = () => {
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
};

export default TrustTriangleExamples;
