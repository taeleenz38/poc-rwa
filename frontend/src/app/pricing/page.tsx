"use client";
import React from "react";
import FundDetails from "@/app/components/organisms/FundDetails";
import SetPrice from "@/app/components/organisms/Popups/SetPrice";
import UpdatePrice from "@/app/components/organisms/Popups/UpdatePrice";
import {
  EthIcon,
  SolanaIcon,
  MoonbeamIcon,
  LiquidIcon,
  BaseIcon,
} from "@/app/components/atoms/Icons";
import PriceList from "../components/molecules/PriceList";

const Pricing = () => {
  const [isSetPriceOpen, setIsSetPriceOpen] = React.useState(false);
  const [isUpdatePriceOpen, setIsUpdatePriceOpen] = React.useState(false);
  const handleButton1Click = () => {
    setIsSetPriceOpen(true);
  };

  const handleButton2Click = () => {
    setIsUpdatePriceOpen(true);
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
        Button1Text="Add Price"
        Button2Text="Update Price"
        Button1Class="bg-light text-primary hover:bg-primary hover:text-light"
        Button2Class="bg-secondary text-light hover:bg-primary"
        onButton1Click={handleButton1Click}
        onButton2Click={handleButton2Click}
        chains={
          <>
            <EthIcon className="lg:w-8 lg:h-8" />
          </>
        }
        view={"PriceList"}
      />
      <SetPrice
        isOpen={isSetPriceOpen}
        onClose={() => setIsSetPriceOpen(false)}
      />
      <UpdatePrice
        isOpen={isUpdatePriceOpen}
        onClose={() => setIsUpdatePriceOpen(false)}
      />
    </div>
  );
};

export default Pricing;
