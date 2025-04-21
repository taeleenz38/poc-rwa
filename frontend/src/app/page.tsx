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
    <main className="min-h-screen bg-white root-container text-secondary">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold w-full">
        Seamless FX and debt liquidity across traditional and decentralized
        ecosystems.
      </h1>
      <h2 className="text-lg sm:text-xl mt-4 sm:mt-6 lg:mt-8 w-full">
        We connect capital markets across TradFi and DeFi to power the next
        generation of financial infrastructure.
      </h2>
      <div className="flex justify-between mt-24  ">
        <div className="flex flex-col gap-y-5 mt-2 md:mr-24">
          <h2 className="text-lg sm:text-3xl font-semibold">
            Explore Institutional Strategies on Block Majority
          </h2>
          <h3 className="text-lg sm:text-xl">
            Block Majority offers curated tokenized investment strategies
            designed for stability, yield, and growth across global markets.
          </h3>

          <div className="space-y-5 text-base sm:text-lg">
            <div>
              <p>
                <b>VLR (Velora)</b> is a tokenized money market fund focused on
                the Australian dollar. The strategy seeks to deliver stable,
                low-volatility returns by investing in short-term, high-grade
                debt instruments such as Australian bank bills. This product is
                ideal for investors seeking capital preservation and consistent
                yield with daily liquidity.
              </p>
            </div>

            <div>
              <p>
                <b>EQV (Equivest)</b> provides exposure to a diversified basket
                of public equities and strategic assets across Asia’s emerging
                markets. Designed to capture long-term capital growth, EQV
                leverages local insights and institutional partnerships to
                identify opportunities in sectors like technology,
                infrastructure, and consumer growth.
              </p>
            </div>

            <ul className="list-disc pl-5 space-y-2">
              <li>
                Tokenised access with daily subscriptions and redemptions.
              </li>
              <li>
                All yield is accrued daily and recorded transparently on-chain.
              </li>
              <li>
                Built on Ethereum Sepolia Testnet for enhanced transparency and
                auditability.
              </li>
            </ul>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            * These investment opportunities are available to{" "}
            <b>Wholesale Investors</b> only. Capital is at risk. Past
            performance is not indicative of future results. Please consult with
            a licensed advisor.
          </p>
        </div>
        <div className="flex flex-col items-center md:items-start gap-4">
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
      </div>
    </main>
  );
}
