"use client";

import React from "react";
import { EthIcon } from "../components/atoms/Icons";
import Contact from "../components/molecules/Contact";
import FundDetails from "../components/organisms/FundDetails";
import SetPrice from "../components/organisms/Popups/SetPrice";
import UpdatePrice from "../components/organisms/Popups/UpdatePrice";

const page = () => {
  const [isSetPriceOpen, setIsSetPriceOpen] = React.useState(false);
  const [isUpdatePriceOpen, setIsUpdatePriceOpen] = React.useState(false);
  const handleButton1Click = () => {};

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
        Button1Text="Approve Redeem"
        Button2Text="Hidden "
        Button1Class="bg-light text-primary hover:bg-primary hover:text-light"
        Button2Class="bg-secondary text-light hover:bg-primary hidden"
        onButton1Click={handleButton1Click}
        onButton2Click={() => {}}
        chains={
          <>
            <EthIcon className="lg:w-8 lg:h-8" />
          </>
        }
        view={"RedemptionList"}
      />

      <Contact />
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

export default page;
