"use client";
import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useAccount, useReadContract, useBalance } from "wagmi";
import { useVlrData } from "@/hooks/useVlrData";
import { useEqvData } from "@/hooks/useEqvData";
import { config } from "@/config";
import HomepageCard from "./components/molecules/HomepageCard";
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
    <main className="min-h-screen w-full bg-white text-secondary">
      <div className="flex h-[500px] bg-[url('/home-bg.jpg')] bg-cover bg-center bg-no-repeat text-white pt-20">
        <div className="flex flex-col w-[1000px] mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium">
            Seamless FX and debt liquidity across traditional and decentralized
            ecosystems.
          </h1>
          <h3 className="text-lg md:text-xl mt-4 sm:mt-8">
            We connect capital markets across TradFi and DeFi to power the next
            generation of financial infrastructure.
          </h3>
          <p className="text-xs mt-4 sm:mt-8">
            Investment opportunities are available to <b>Wholesale Investors</b>{" "}
            only. Past performance is not indicative of future results.
          </p>
        </div>
      </div>
      <div className="text-center text-5xl mt-32 mb-8 font-medium">
        Liquid Fund Tokens
      </div>
      <div className="flex justify-center items-center md:items-start gap-12 mb-36">
        <PackageCard
          heading="VLR"
          subHeading="Velora - Stable AUD Yield"
          PRICE={vlrPrice}
          TVL={formatLargeNumber(parseFloat(vlrNav))}
          href="/investVLR"
          backgroundImage="url('/Graphic1.avif')"
          footerText="Invest -->"
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
          footerText="Invest -->"
          chains={<EthIcon />}
          imageSrc="/EQV.png"
        />
      </div>
      <div className="text-center text-4xl mt-16 mb-12 font-medium">
        Onchain & DeFi Ready
      </div>
      <div className="flex w-[1100px] gap-12 mb-36 mx-auto">
        <HomepageCard
          src="/institutional.svg"
          title="Institutional Grade"
          description="Built with the performance, security, and scalability standards demanded by banks and large financial institutions."
        />
        <HomepageCard
          src="/regulatory.svg"
          title="Regulatory Compliant"
          description="Designed to align with evolving legal frameworks to ensure safe, secure, and compliant access to digital assets."
        />
        <HomepageCard
          src="/defi.svg"
          title="DeFi Composability"
          description="Tokenised access with instant issuance and redemption of ERC-20 tokens (Velora + Equivest)."
        />
      </div>
    </main>
  );
}
