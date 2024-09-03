"use client";
import React, { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect, useReadContract } from "wagmi";
import { config } from "@/config";
import ayfabi from "@/artifacts/ABBY.json";
import FundDetails2 from "@/app/components/organisms/FundDetails2";
import FundDescription from "@/app/components/organisms/FundDescription";
import Buy from "@/app/components/organisms/Popups/RequestDeposit";
import Redeem from "@/app/components/organisms/Popups/RequestRedemption";
import { EthIcon } from "@/app/components/atoms/Icons";
import { GET_PRICE_LIST, GET_ACCOUNT_STATUS } from "@/lib/urqlQueries";
import { BigNumber, ethers } from "ethers";
import axios from "axios";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useQuery } from "urql";

interface Item {
  date: string;
  price: string;
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

const Invest = () => {
  const { address, isConnected } = useAccount({ config });
  const { open } = useWeb3Modal();
  const [isFetching, setIsFetching] = useState(true);
  const [price, setPrice] = useState<string | null>(null);
  const [isBuyOpen, setIsBuyOpen] = React.useState(false);
  const [isRedeemOpen, setIsRedeemOpen] = React.useState(false);
  const [tvl, setTvl] = useState<string>("...");
  const [userStatus, setUserStatus] = useState<"Active" | "Inactive">(
    "Inactive"
  );
  const email = localStorage.getItem("username");

  const [{ data: accountStatusData }, reexecuteQueryAccountStatus] = useQuery({
    query: GET_ACCOUNT_STATUS,
    variables: { email },
  });

  const [{ data: priceListData, error: priceListError }] = useQuery({
    query: GET_PRICE_LIST,
  });

  const handleButton1Click = () => {
    if (!isConnected) {
      open();
    } else {
      setIsBuyOpen(true);
    }
  };

  const handleButton2Click = () => {
    if (!isConnected) {
      open();
    } else {
      setIsRedeemOpen(true);
    }
  };

  useEffect(() => {
    if (accountStatusData) {
      const status =
        accountStatusData.latestUniqueAccountStatusSetByAdmins.find(
          (status: { account: string | null }) => status.account === email
        );
      setUserStatus(status?.status === "Active" ? "Active" : "Inactive");
    }
  }, [accountStatusData, email]);

  useEffect(() => {
    if (priceListData) {
      const sortedPriceList = priceListData.priceAddeds.sort(
        (a: Item, b: Item) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const latestPrice = sortedPriceList[0];
      setPrice(latestPrice ? latestPrice.price : "...");
    }
  }, [priceListData]);

  const formattedPrice = price
    ? formatNumber(parseFloat(weiToEther(price)))
    : "...";

  const { data: totalSupply } = useReadContract({
    abi: ayfabi.abi,
    address: process.env.NEXT_PUBLIC_AYF_ADDRESS as `0x${string}`,
    functionName: "totalSupply",
  });

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

  return (
    <div className="">
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
        Button1Class={`bg-white text-primary hover:bg-primary hover:text-light ${
          userStatus === "Inactive" &&
          "bg-white text-primary/60 hover:bg-white hover:text-primary/60"
        }`}
        Button2Class={`bg-secondary text-light hover:bg-primary ${
          userStatus === "Inactive" && "bg-white text-primary/60 hover:bg-white"
        }`}
        onButton1Click={handleButton1Click}
        onButton2Click={handleButton2Click}
        userStatus={userStatus}
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
