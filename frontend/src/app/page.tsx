"use client";
import React, { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import ayfabi from "@/artifacts/ABBY.json";
import { config } from "@/config";
import { BigNumber, ethers } from "ethers";
import { PackageCard } from "./components/organisms/PackageCard";
import { EthIcon } from "@/app/components/atoms/Icons";

interface Item {
  date: string;
  price: string;
}

const formatNumberWithCommas = (number: number | string): string => {
  const num = typeof number === "string" ? parseFloat(number) : number;
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function Home() {
  const { address } = useAccount({
    config,
  });
  const [isFetching, setIsFetching] = useState(true);
  const [price, setPrice] = useState<string | null>(null);
  const [isBuyOpen, setIsBuyOpen] = React.useState(false);
  const [isRedeemOpen, setIsRedeemOpen] = React.useState(false);
  const [tvl, setTvl] = useState<string>("...");
  const [userStatus, setUserStatus] = useState<boolean>(false);

  const handleButton1Click = () => {
    setIsBuyOpen(true);
  };

  const handleButton2Click = () => {
    setIsRedeemOpen(true);
  };

  const { data: totalSupply } = useReadContract({
    abi: ayfabi.abi,
    address: process.env.NEXT_PUBLIC_AYF_ADDRESS as `0x${string}`,
    functionName: "totalSupply",
  });

  // const convertBigIntToBigNumber = (bigIntValue: bigint): BigNumber => {
  //   return BigNumber.from(bigIntValue.toString());
  // };

  useEffect(() => {
    const fetchLatestPrice = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/price-list`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Price data:", data);

        if (Array.isArray(data) && data.length > 0) {
          const latestPrice = data.sort(
            (a: Item, b: Item) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          )[0];

          const fetchedPrice = latestPrice ? latestPrice.price : "0";
          setPrice(fetchedPrice);
        } else {
          console.error("Price list data is empty or not an array.");
        }
      } catch (error) {
        console.error("Error fetching the latest price:", error);
      }
    };

    fetchLatestPrice();
  }, []);

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

          const tvlValue = (
            parseFloat(formattedSupply) * parseFloat(price)
          ).toFixed(2);
          setTvl(formatNumberWithCommas(tvlValue));
        } catch (error) {
          console.error("Error calculating TVL:", error);
        }
      }
    };

    calculateTVL();
  }, [price]);

  const formattedPrice = price
    ? formatNumberWithCommas(parseFloat(price))
    : "...";

  return (
    <main className="h-screen bg-white root-container text-black">
      <h1 className="text-5xl font-semibold w-3/5">
        Institutional-Grade FX and Debt Liquidity, bridging TradFi and DeFi.
      </h1>
      <h2 className="text-xl mt-8 w-1/2">
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
