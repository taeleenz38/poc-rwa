import React from "react";
import Balance from "@/app/components/molecules/Balance";

const Portfolio = () => {
  return (
    <div className="flex flex-col px-96 py-6">
      <h1 className="text-2xl font-semibold mb-4">Your Portfolio</h1>
      <h3 className="mb-8">Take and manage your portfolio</h3>
      <h2 className="font-semibold text-xl mb-3">Current Portfolio Value</h2>
      <Balance />
      <h3 className="mt-20">Take and manage your portfolio</h3>

    </div>
  );
};

export default Portfolio;
