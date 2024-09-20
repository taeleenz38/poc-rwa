"use client";
import React, { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import ayfabi from "@/artifacts/ABBY.json";
import { config } from "@/config";
import { ethers } from "ethers";
import { PackageCard } from "./components/organisms/PackageCard";
import { EthIcon } from "@/app/components/atoms/Icons";
import { useQuery } from "urql";
import { GET_PRICE_LIST } from "@/lib/urqlQueries";

interface PriceData {
  priceAddeds: {
    id: string;
    price: string;
    date: string;
    status: string;
  }[];
}

// Convert wei to ether
const weiToEther = (wei: string | number): string => {
  return ethers.utils.formatUnits(wei, 18);
};

// Format number with commas and fixed decimals
const formatNumber = (
  number: number | string,
  decimalPlaces: number = 2
): string => {
  const num = typeof number === "string" ? parseFloat(number) : number;
  return num.toLocaleString(undefined, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
};

export default function Home() {
  const { address } = useAccount({
    config,
  });
  const [isFetching, setIsFetching] = useState(true);
  const [price, setPrice] = useState<string | null>(null);
  const [tvl, setTvl] = useState<string>("...");

  const { data: totalSupply } = useReadContract({
    abi: ayfabi.abi,
    address: process.env.NEXT_PUBLIC_AYF_ADDRESS as `0x${string}`,
    functionName: "totalSupply",
  });

  const [{ data, fetching, error }] = useQuery<PriceData>({
    query: GET_PRICE_LIST,
  });

  useEffect(() => {
    if (!fetching && data) {
      const latestPrice = data.priceAddeds[0];
      console.log("latestPrice", latestPrice);

      const fetchedPrice = latestPrice ? latestPrice.price : "0";
      setPrice(fetchedPrice);
      setIsFetching(false);
    }
  }, [fetching, data]);

  useEffect(() => {
    const calculateTVL = async () => {
      if (price) {
        try {
          const provider = new ethers.providers.JsonRpcProvider(
            "https://sepolia.infura.io/v3/87d9d315fbda4c4b93710160977c7370"
          );
          const contractAddress = process.env
            .NEXT_PUBLIC_AYF_ADDRESS as `0x${string}`;
          const abi = ayfabi.abi;
          const contract = new ethers.Contract(contractAddress, abi, provider);

          const supply = await contract.totalSupply();
          const formattedSupply = ethers.utils.formatUnits(supply, 18);

          // Convert price from wei to ether
          const priceInEther = parseFloat(weiToEther(price));

          const tvlValue = (parseFloat(formattedSupply) * priceInEther).toFixed(
            2
          );
          setTvl(formatNumber(tvlValue));
        } catch (error) {
          console.error("Error calculating TVL:", error);
        }
      }
    };

    calculateTVL();
  }, [price]);

  const formattedPrice = price
    ? formatNumber(parseFloat(weiToEther(price)))
    : "...";

  return (
    <main className="min-h-screen bg-white root-container text-black">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold w-full sm:w-4/5 lg:w-3/5">
        Institutional-Grade FX and Debt Liquidity, bridging TradFi and DeFi.
      </h1>
      <h2 className="text-lg sm:text-xl mt-4 sm:mt-6 lg:mt-8 w-full sm:w-3/4 lg:w-1/2">
        Copiam is bridging the next generation of financial infrastructure in
        DeFi with access to the deepest, most efficient institutional FX and
        capital markets in TradFi.
      </h2>
      <div className="flex p-2 mt-4 gap-4 sm:gap-6 lg:gap-11">
        <PackageCard
          heading="AYF"
          subHeading="Australian Yield Fund"
          lpBalance="100"
          PRICE={formattedPrice}
          TVL={tvl}
          href="/invest"
          backgroundImage="url('/Graphic1.png')"
          footerText="For Wholesale Investors"
          chains={<EthIcon />}
        />
        <PackageCard
          heading="HYF"
          subHeading="High Yield Fund"
          lpBalance="100"
          PRICE={"107.34"}
          TVL={"1,240,000"}
          href="/invest"
          backgroundImage="url('/Graphic1.png')"
          footerText="For Retail Investors"
          chains={<EthIcon />}
        />
      </div>
    </main>
  );
}
