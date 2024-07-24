"use client"
import React, { useState } from "react";
import FundDetails from "@/app/components/organisms/FundDetails";
import AddTermAndSetValidTermIndexes from "@/app/components/organisms/Popups/AddTermAndSetValidTermIndexes";
import AddToList from "@/app/components/organisms/Popups/Allowlist";
import {
  BaseIcon,
  EthIcon,
  SolanaIcon,
  MoonbeamIcon,
  LiquidIcon,
} from "@/app/components/atoms/Icons";

const Allowlist = () => {
  const [isAllowlistOpen, setIsAllowlistOpen] = useState(false);
  const [
    isAddTermAndSetValidTermIndexesOpen,
    setIsAddTermAndSetValidTermIndexesOpen,
  ] = useState(false);

  const handleButton1Click = () => {
    setIsAllowlistOpen(true);
  };

  const handleButton2Click = () => {
    setIsAddTermAndSetValidTermIndexesOpen(true);
  };
  return (
    <div className="min-h-screen">
      <FundDetails
        logoSrc="/LOGO.png"
        altText="Fund logo"
        fundName="AYF"
        fundDescription="Copiam Australian Dollar Yield"
        yieldText="Stable, high-quality Australian Dollar yield"
        price="$1.0445"
        tvl="$327.50M"
        Button1Text="Add User To Allowlist"
        Button2Text="Add Terms and Set Valid Term Indexes"
        Button1Class="bg-light text-primary hover:bg-primary hover:text-light"
        Button2Class="bg-[#122A5F] text-light hover:bg-primary"
        onButton1Click={handleButton1Click}
        onButton2Click={handleButton2Click}
        chains={
          <>
            <EthIcon className="lg:w-8 lg:h-8" />
            <SolanaIcon className="lg:w-8 lg:h-8" />
            <LiquidIcon className="lg:w-8 lg:h-8" />
            <BaseIcon className="lg:w-8 lg:h-8" />
            <MoonbeamIcon className="lg:w-8 lg:h-8" />
          </>
        }
      />
      <AddToList
        isOpen={isAllowlistOpen}
        onClose={() => setIsAllowlistOpen(false)}
      />
      <AddTermAndSetValidTermIndexes
        isOpen={isAddTermAndSetValidTermIndexesOpen}
        onClose={() => setIsAddTermAndSetValidTermIndexesOpen(false)}
      />
    </div>
  );
};

export default Allowlist;
