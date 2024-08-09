"use client";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import React, { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import abi from "@/artifacts/ABBY.json";
import { config } from "@/config";
import { BigNumber, ethers } from "ethers";
import { PackageCard } from "./components/organisms/PackageCard";
import {
  BaseIcon,
  EthIcon,
  SolanaIcon,
  MoonbeamIcon,
  LiquidIcon,
} from "@/app/components/atoms/Icons";

interface Item {
  date: string;
  price: string;
}

export default function Home() {
  const { address } = useAccount({
    config,
  });
  const [isFetching, setIsFetching] = useState(true);
  const [price, setPrice] = useState<string | null>(null);
  const [isBuyOpen, setIsBuyOpen] = React.useState(false);
  const [isRedeemOpen, setIsRedeemOpen] = React.useState(false);
  const [tvl, setTvl] = useState<string>("...");
  const handleButton1Click = () => {
    setIsBuyOpen(true);
  };

  const handleButton2Click = () => {
    setIsRedeemOpen(true);
  };

  useEffect(() => {
    const fetchPriceId = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/price-list`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("price data", data);

        // Find the latest price based on the date
        const latestPrice = data.sort(
          (a: Item, b: Item) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];

        // Update the state with the latest price
        setPrice(latestPrice ? latestPrice.price : "0");
      } catch (error) {
        console.error("Error fetching price ID:", error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchPriceId();
  }, []);

  const formattedPrice = price ? parseFloat(price).toFixed(2) : "...";

  const { data: totalSupply } = useReadContract({
    abi: abi.abi,
    address: process.env.NEXT_PUBLIC_AYF_ADDRESS as `0x${string}`,
    functionName: "totalSupply",
  });

  const convertBigIntToBigNumber = (bigIntValue: bigint): BigNumber => {
    return BigNumber.from(bigIntValue.toString());
  };

  useEffect(() => {
    const calculateTVL = () => {
      if (totalSupply && price) {
        try {
          let totalSupplyNormal;
          // Handle BigInt case
          if (typeof totalSupply === "bigint") {
            const bigNumberSupply = convertBigIntToBigNumber(totalSupply);
            totalSupplyNormal = ethers.utils.formatUnits(bigNumberSupply, 18);
          } else if (BigNumber.isBigNumber(totalSupply)) {
            totalSupplyNormal = ethers.utils.formatUnits(totalSupply, 18);
          } else {
            console.error("Invalid totalSupply format:", totalSupply);
            return;
          }

          const tvlValue = (
            parseFloat(totalSupplyNormal) * parseFloat(price)
          ).toFixed(2);

          setTvl(tvlValue);
        } catch (error) {
          console.error("Error calculating TVL:", error);
        }
      }
    };

    calculateTVL();
  }, [totalSupply, price]);

  return (
    <main className="h-screen bg-white root-container text-black">
      <h1 className="text-5xl font-semibold w-3/5">
        Institutional-Grade FX and Debt Liquidity, bridging TradFi and DeFi.
      </h1>
      <h2 className="text-xl mt-4 w-1/2  ">
        Copiam is bridging the next generation of financial infrastructure in
        DeFi with access to the deepest, most efficient institutional FX and
        capital markets in TradFi.
      </h2>
      <div className="flex p-2 mt-4 gap-11">
        <PackageCard
          heading="AYF"
          subHeading="Australian Yield Fund"
          PRICE={formattedPrice}
          TVL={tvl}
          href="/invest"
          backgroundImage="url('/Graphic1.png')"
          footerText="For Wholesale Investors"
          chains={
            <>
              <EthIcon />
            </>
          }
        />
      </div>
    </main>
  );
}
