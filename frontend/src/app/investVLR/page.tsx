"use client";
import React, { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect, useReadContract } from "wagmi";
import { config } from "@/config";
import FundDetails from "@/app/components/organisms/FundDetails";
import VLRInfo from "@/app/components/molecules/VLRInfo";
import HomepageCard from "@/app/components/molecules/HomepageCard";
import Buy from "@/app/components/organisms/Popups/RequestDeposit";
import Redeem from "@/app/components/organisms/Popups/RequestRedemption";
import { EthIcon } from "@/app/components/atoms/Icons";
import axios from "axios";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useVlrData } from "@/hooks/useVlrData";
import FundDescription from "../components/organisms/FundDescription";

interface Item {
  date: string;
  price: string;
}

const InvestVLR = () => {
  const { address, isConnected } = useAccount({ config });
  const { vlrNav, vlrTotalSupply, vlrPrice } = useVlrData();
  const { open } = useWeb3Modal();
  const [isBuyOpen, setIsBuyOpen] = React.useState(false);
  const [isRedeemOpen, setIsRedeemOpen] = React.useState(false);
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

  const formatLargeNumber = (num: number): string => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num.toFixed(2);
  };

  return (
    <div className="">
      <FundDetails
        logoSrc="/VLR.jpg"
        altText="Fund logo"
        fundName="VLR"
        fundDescription="Velora - AUD Yield Token"
        yieldText="Short-Term Yield, Long-Term Confidence"
        apy={"4.25"}
        price={vlrPrice}
        tvl={formatLargeNumber(parseFloat(vlrNav))}
        Button1Text="Buy VLR"
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
            <EthIcon className="lg:w-8 lg:h-8 m-0 p-0" />
          </>
        }
      />
      <VLRInfo />
      <div className="text-center text-4xl mt-6 mb-12 font-medium text-secondary">
        Onchain & DeFi Ready
      </div>
      <div className="flex justify-center w-[1100px] gap-12 mb-16 mx-auto">
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
      <FundDescription />
      <Buy isOpen={isBuyOpen} onClose={() => setIsBuyOpen(false)} />
      <Redeem isOpen={isRedeemOpen} onClose={() => setIsRedeemOpen(false)} />
    </div>
  );
};

export default InvestVLR;
