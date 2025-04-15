"use client";
import React, { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect, useReadContract } from "wagmi";
import { config } from "@/config";
import ayfabi from "@/artifacts/ABBY.json";
import { useEqvData } from "@/hooks/useEqvData";
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

const formatLargeNumber = (num: number): string => {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toFixed(2);
};

const InvestEQV = () => {
  const { address, isConnected } = useAccount({ config });
  const { eqvNav, eqvTotalSupply, eqvPrice } = useEqvData();
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

  return (
    <div className="">
      <FundDetails2
        logoSrc="/EQV.png"
        altText="Fund logo"
        fundName="EQV"
        fundDescription="Equivest - Asian Emerging Markets"
        yieldText="High-growth, Asian Emerging Markets Fund"
        price={eqvPrice}
        tvl={formatLargeNumber(parseFloat(eqvNav))}
        Button1Text="Buy EQV"
        Button2Text="Redeem"
        Button1Class={`bg-primary text-light hover:bg-secondary-focus ${userStatus === "Inactive" && "bg-white text-secondary hover:bg-white"
          }`}
        Button2Class={`bg-primary text-light hover:bg-secondary-focus ${userStatus === "Inactive" && "bg-white text-secondary hover:bg-white"
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

export default InvestEQV;
