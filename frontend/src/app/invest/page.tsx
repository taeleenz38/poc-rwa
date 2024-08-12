"use client";
import React, { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { config } from "@/config";
import abi from "@/artifacts/ABBY.json";
import FundDetails2 from "@/app/components/organisms/FundDetails2";
import FundDescription from "@/app/components/organisms/FundDescription";
import Buy from "@/app/components/organisms/Popups/RequestDeposit";
import Redeem from "@/app/components/organisms/Popups/RequestRedemption";
import { EthIcon } from "@/app/components/atoms/Icons";
import { BigNumber, ethers } from "ethers";

interface Item {
  date: string;
  price: string;
}

const formatNumberWithCommas = (number: number | string): string => {
  const num = typeof number === "string" ? parseFloat(number) : number;
  // Format number with commas and ensure two decimal places
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const Invest = () => {
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

        const latestPrice = data.sort(
          (a: Item, b: Item) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];

        setPrice(latestPrice ? latestPrice.price : "...");
      } catch (error) {
        console.error("Error fetching price ID:", error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchPriceId();
  }, []);

  const formattedPrice = price
    ? formatNumberWithCommas(parseFloat(price))
    : "...";

  const { data: totalSupply } = useReadContract({
    abi: abi.abi,
    address: process.env.NEXT_PUBLIC_AYF_ADDRESS as `0x${string}`,
    functionName: "totalSupply",
  });

  // const convertBigIntToBigNumber = (bigIntValue: bigint): BigNumber => {
  //   return BigNumber.from(bigIntValue.toString());
  // };

  // useEffect(() => {
  //   const calculateTVL = () => {
  //     if (totalSupply && price) {
  //       try {
  //         let totalSupplyNormal;
  //         // Handle BigInt case
  //         if (typeof totalSupply === "bigint") {
  //           const bigNumberSupply = convertBigIntToBigNumber(totalSupply);
  //           totalSupplyNormal = ethers.utils.formatUnits(bigNumberSupply, 18);
  //         } else if (BigNumber.isBigNumber(totalSupply)) {
  //           totalSupplyNormal = ethers.utils.formatUnits(totalSupply, 18);
  //         } else {
  //           console.error("Invalid totalSupply format:", totalSupply);
  //           return;
  //         }

  //         const tvlValue = (
  //           parseFloat(totalSupplyNormal) * parseFloat(price)
  //         ).toFixed(2);

  //         setTvl(formatNumberWithCommas(tvlValue));
  //       } catch (error) {
  //         console.error("Error calculating TVL:", error);
  //       }
  //     }
  //   };

  //   calculateTVL();
  // }, [totalSupply, price]);

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

  return (
    <div className="w-screen">
      <FundDetails2
        logoSrc="/LOGO.png"
        altText="Fund logo"
        fundName="AYF"
        fundDescription="Copiam Australian Yield Fund"
        yieldText="Stable, high-quality Australian Yield Fund"
        price={formattedPrice}
        tvl={tvl}
        Button1Text="Buy AYF"
        Button2Text="Redeem"
        Button1Class="bg-white text-primary hover:bg-primary hover:text-light"
        Button2Class="bg-secondary text-light hover:bg-primary"
        onButton1Click={handleButton1Click}
        onButton2Click={handleButton2Click}
        chains={
          <>
            <EthIcon className="lg:w-8 lg:h-8" />
          </>
        }
      />
      <FundDescription />
      <Buy isOpen={isBuyOpen} onClose={() => setIsBuyOpen(false)} />
      <Redeem isOpen={isRedeemOpen} onClose={() => setIsRedeemOpen(false)} />
    </div>
  );
};

export default Invest;
