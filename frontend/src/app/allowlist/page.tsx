"use client";
import React, { useState } from "react";
import FundDetails from "@/app/components/organisms/FundDetails";
import AddTermAndSetValidTermIndexes from "@/app/components/organisms/Popups/AddTermAndSetValidTermIndexes";
import AddToList from "@/app/components/organisms/Popups/Allowlist";
import AllowlistWallets from "@/app/components/organisms/AllowlistWallets";
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
    <div className="min-h-screen bg-white">
      <FundDetails
        logoSrc="/LOGO.png"
        altText="Fund logo"
        fundName="AYF"
        fundDescription="Copiam Australian Yield Fund"
        yieldText="Stable, high-quality Australian Yield Fund"
        price="$1.0445"
        tvl="$327.50M"
        Button1Text="Add User To Allowlist"
        Button2Text="Add Terms and Set Valid Term Indexes"
        Button1Class="bg-light text-primary hover:bg-primary hover:text-light"
        Button2Class="bg-secondary text-light hover:bg-primary hidden"
        onButton1Click={handleButton1Click}
        onButton2Click={handleButton2Click}
        chains={
          <>
            <EthIcon className="lg:w-8 lg:h-8" />
          </>
        }
        view={"AllowList"}
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
