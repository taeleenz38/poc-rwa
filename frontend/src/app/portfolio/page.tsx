import React from "react";
import Balance from "@/app/components/molecules/Balance";

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-light flex flex-col px-96 py-6">
      <h1 className="text-2xl font-semibold mb-4">Your Portfolio</h1>
      <h3 className="mb-12">Take and manage your portfolio</h3>
      <h2 className="font-semibold text-2xl mb-3">Stable Coin Balance</h2>
      <Balance />
      <h2 className="font-semibold text-2xl mt-12 mb-3">AYF Token Balance</h2>
      <Balance />
    </div>
  );
};

export default Portfolio;
