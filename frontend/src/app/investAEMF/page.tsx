"use client";
import React, { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect, useReadContract } from "wagmi";
import { config } from "@/config";
import ayfabi from "@/artifacts/ABBY.json";
import FundDetails2 from "@/app/components/organisms/FundDetails2";
import FundDescription2 from "@/app/components/organisms/FundDescription2";
import Buy from "@/app/components/organisms/Popups/RequestDepositAEMF";
import Redeem from "@/app/components/organisms/Popups/RequestRedemptionAEMF";
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

const InvestAEMF = () => {
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

  const fetchUserStatus = async (user: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/auth/status?email=${user}`
      );
      if (response.status === 200 || 201) {
        if (response.data.isActive === true) {
          setUserStatus("Active");
        } else {
          setUserStatus("Inactive");
        }
      }
    } catch (err) {
      console.error("Failed to fetch status ", err);

      setUserStatus("Inactive");
    }
  };

  fetchUserStatus(email as string);

  useEffect(() => {
    const fetchAemfPrice = async () => {
      try {
        const requestOptions: RequestInit = {
          method: "GET",
          redirect: "follow" as RequestRedirect,
        };

        const response = await fetch(`${process.env.NEXT_PUBLIC_FILE_API}/file-upload/chainlink/aemf`, requestOptions)
        const result = await response.json();
        console.log(result)

        const parsedPrice = parseFloat(result.NAV);
        setPrice(formatNumber(parsedPrice, 2));
      } catch (error) {
        console.error("Error fetching AEMF price:", error);
      }
    };

    fetchAemfPrice();
  }, []);

  const { data: totalSupply } = useReadContract({
    abi: ayfabi.abi,
    address: process.env.NEXT_PUBLIC_AEMF_ADDRESS as `0x${string}`,
    functionName: "totalSupply",
  });

  // Format large numbers (e.g., 1,000,000 -> 1.0M)
  const formatLargeNumber = (num: number): string => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num.toFixed(2);
  };

  useEffect(() => {
    const calculateTVL = async () => {
      if (price) {
        try {
          const provider = new ethers.providers.JsonRpcProvider(
            "https://sepolia.infura.io/v3/87d9d315fbda4c4b93710160977c7370"
          );
          const contractAddress = process.env
            .NEXT_PUBLIC_AEMF_ADDRESS as `0x${string}`;
          const abi = ayfabi.abi;
          const contract = new ethers.Contract(contractAddress, abi, provider);

          const supply = await contract.totalSupply();
          const formattedSupply = ethers.utils.formatUnits(supply, 18);

          const priceInEther = parseFloat(price);

          const tvlValue = parseFloat(formattedSupply) * priceInEther;

          setTvl(formatLargeNumber(tvlValue));
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
        logoSrc="/BM-LOGO.png"
        altText="Fund logo"
        fundName="AEMF"
        fundDescription="Block Majority Asian Emerging Markets Fund"
        yieldText="High-growth, Asian Emerging Markets Fund"
        price={price || "..."}
        tvl={tvl}
        Button1Text="Buy AEMF"
        Button2Text="Redeem"
        Button1Class={`bg-primary text-light hover:bg-secondary-focus ${
          userStatus === "Inactive" && "bg-white text-secondary hover:bg-white"
        }`}
        Button2Class={`bg-primary text-light hover:bg-secondary-focus ${
          userStatus === "Inactive" && "bg-white text-secondary hover:bg-white"
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
      <FundDescription2 />
      <Buy isOpen={isBuyOpen} onClose={() => setIsBuyOpen(false)} />
      <Redeem isOpen={isRedeemOpen} onClose={() => setIsRedeemOpen(false)} />
    </div>
  );
};

export default InvestAEMF;
