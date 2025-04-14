"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useAccount, useReadContract, useBalance } from "wagmi";
import { useVlrData } from "@/hooks/useVlrData";
import { useEqvData } from "@/hooks/useEqvData";
import { config } from "@/config";
import { ethers } from "ethers";
import { PackageCard } from "./components/organisms/PackageCard";
import { EthIcon } from "@/app/components/atoms/Icons";


export default function Home() {
  const { address } = useAccount({
    config,
  });
  const { vlrNav, vlrTotalSupply, vlrPrice } = useVlrData();
  const { eqvNav, eqvTotalSupply, eqvPrice } = useEqvData();


  const formatLargeNumber = (num: number): string => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num.toFixed(2);
  };

  return (
    <main className="min-h-screen bg-white root-container text-black">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold w-full sm:w-4/5 lg:w-3/5">
        Institutional-Grade FX and Debt Liquidity, bridging TradFi and DeFi.
      </h1>
      <h2 className="text-lg sm:text-xl mt-4 sm:mt-6 lg:mt-8 w-full sm:w-3/4 lg:w-1/2">
        Block Majority is bridging the next generation of financial
        institutional FX and capital markets in TradFi.
      </h2>
      <div className="flex p-2 mt-4 gap-4 sm:gap-6 lg:gap-11">
        <PackageCard
          heading="VLR"
          subHeading="Velora - Stable AUD Yield"
          PRICE={vlrPrice}
          TVL={formatLargeNumber(parseFloat(vlrNav))}
          href="/investVLR"
          backgroundImage="url('/Graphic1.avif')"
          footerText="For Wholesale Investors"
          chains={<EthIcon />}
          imageSrc="/VLR.jpg"
        />
        <PackageCard
          heading="EQV"
          subHeading="Equivest - Asian Emerging Markets"
          PRICE={eqvPrice}
          TVL={formatLargeNumber(parseFloat(eqvNav))}
          href="/investEQV"
          backgroundImage="url('/Fund-2.jpg')"
          footerText="For Wholesale Investors"
          chains={<EthIcon />}
          imageSrc="/EQV.png"
        />
      </div>
    </main>
  );
}
