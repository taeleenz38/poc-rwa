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

const Invest = () => {
  const { address } = useAccount({
    config,
  });
  const [isFetching, setIsFetching] = useState(true);
  const [price, setPrice] = useState<string | null>(null);
  const [isBuyOpen, setIsBuyOpen] = React.useState(false);
  const [isRedeemOpen, setIsRedeemOpen] = React.useState(false);
  const [tvl, setTvl] = useState<string>("0");

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

  const formattedPrice = price ? parseFloat(price).toFixed(2) : "0";

  const { data: totalSupply } = useReadContract({
    abi: abi.abi,
    address: process.env.NEXT_PUBLIC_AYF_ADDRESS as `0x${string}`,
    functionName: "totalSupply",
  });

  useEffect(() => {
    const calculateTVL = () => {
      if (totalSupply && price) {
        try {
          // Ensure totalSupply is a BigNumber
          if (BigNumber.isBigNumber(totalSupply)) {
            // Convert totalSupply from BigNumber to a normal number
            const totalSupplyNormal = ethers.utils.formatUnits(totalSupply, 18);

            // Calculate TVL
            const tvlValue = (
              parseFloat(totalSupplyNormal) * parseFloat(price)
            ).toFixed(2);

            setTvl(tvlValue);
          } else {
            console.error("Invalid totalSupply format");
          }
        } catch (error) {
          console.error("Error calculating TVL:", error);
        }
      }
    };

    calculateTVL();
  }, [totalSupply, price]);

  return (
    <div>
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
