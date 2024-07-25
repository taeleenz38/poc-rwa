"use client";
import React from "react";
import { useAccount, useBalance } from "wagmi";
import { config } from "@/config";
import Balance from "@/app/components/molecules/Balance"; 

const Portfolio = () => {
  const { address } = useAccount({
    config,
  });

  const { data: audcData, isLoading: audcLoading } = useBalance({
    address,
    token: process.env.NEXT_PUBLIC_AUDC_ADDRESS as `0x${string}`,
    config,
  });

  const { data: ayfData, isLoading: ayfLoading } = useBalance({
    address,
    token: process.env.NEXT_PUBLIC_AYF_ADDRESS as `0x${string}`,
    config,
  });

  return (
    <div className="min-h-screen bg-light flex flex-col pt-24">
      <h1 className="px-96 text-3xl font-semibold mb-4">Your Portfolio</h1>
      <h3 className="px-96 mb-12">Take and manage your portfolio</h3>
      <Balance tokenSymbol="AUDC" balanceData={audcData} isLoading={audcLoading} />
      <Balance tokenSymbol="AYF" balanceData={ayfData} isLoading={ayfLoading} />
      <div className="bg-primary flex-grow mt-20 px-96 py-8 text-light">
        <h2 className="font-medium text-2xl">Claimable AYF Tokens</h2>
      </div>
    </div>
  );
};

export default Portfolio;
