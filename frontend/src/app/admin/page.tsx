"use client";
import React from "react";
import FundDetails from "@/app/components/organisms/FundDetails";
import {
  EthIcon,
  SolanaIcon,
  MoonbeamIcon,
  LiquidIcon,
  BaseIcon,
} from "@/app/components/atoms/Icons";
import PricingSection from "@/app/components/molecules/PricingSection";

const Pricing = () => {
  const handleButton1Click = () => {};

  const handleButton2Click = () => {};

  return (
    <div className="min-h-screen bg-primary">
      <FundDetails
        logoSrc="/LOGO.png"
        altText="Fund logo"
        fundName="AYF"
        fundDescription="Copiam Australian Dollar Yield"
        yieldText="Stable, high-quality Australian Dollar yield"
        price="$1.0445"
        tvl="$327.50M"
        Button1Text="Add Price"
        Button2Text="Update Price"
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
      <PricingSection />
    </div>
  );
};

export default Pricing;
