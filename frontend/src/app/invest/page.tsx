"use client";

import React from "react";
import FundDetails from "@/app/components/organisms/FundDetails";
import FundDescription from "@/app/components/organisms/FundDescription";
import {
  BaseIcon,
  EthIcon,
  SolanaIcon,
  MoonbeamIcon,
  LiquidIcon,
} from "@/app/components/atoms/Icons";

const Invest = () => {
  return (
    <div>
      <FundDetails
        logoSrc="/LOGO.png"
        altText="Fund logo"
        fundName="AYF"
        fundDescription="Copiam Australian Dollar Yield"
        yieldText="Stable, high-quality Australian Dollar yield"
        price="$1.0445"
        tvl="$327.50M"
        Button1Text="Buy"
        Button2Text="Redeem"
        Button1Class="bg-light text-primary hover:bg-primary hover:text-light"
        Button2Class="bg-[#122A5F] text-light hover:bg-primary"
        onButton1Click={() => {}}
        onButton2Click={() => {}}
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
      <FundDescription />
    </div>
  );
};

export default Invest;
