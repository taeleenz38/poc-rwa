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
    <div className="min-h-screen bg-light flex flex-col px-96 py-24">
      <h1 className="text-2xl font-semibold mb-4">Your Portfolio</h1>
      <h3 className="mb-12">Take and manage your portfolio</h3>
      <Balance tokenSymbol="AUDC" balanceData={audcData} isLoading={audcLoading} />
      <Balance tokenSymbol="AYF" balanceData={ayfData} isLoading={ayfLoading} />
    </div>
  );
};

export default Portfolio;
