"use client";
import React, { useState } from "react";
import Image from "next/image";
import Button from "@/app/components/atoms/Buttons/Button";
import RequestDeposit from "@/app/components/organisms/Popups/RequestDeposit";
import RequestRedemption from "@/app/components/organisms/Popups/RequestRedemption";
import Allowlist from "@/app/components/organisms/Popups/AllowlistPopUp";
import AddTermAndSetValidTermIndexes from "@/app/components/organisms/Popups/AddTermAndSetValidTermIndexes";
import PriceList from "../molecules/PriceList";
import AllowlistWallets from "./AllowlistWallets";
import RedemptionList from "../molecules/RedemptionList";

type FundDetailsProps = {
  logoSrc: string;
  altText: string;
  fundName: string;
  fundDescription: string;
  yieldText: string;
  price: string;
  tvl: string;
  chains: React.ReactNode;
  Button1Text: string;
  Button2Text: string;
  Button1Class: string;
  Button2Class: string;
  onButton1Click: () => void;
  onButton2Click: () => void;
  view: "RedemptionList" | "AllowList" | "PriceList" | "Invest";
};

const FundDetails = (props: FundDetailsProps) => {
  const {
    logoSrc,
    altText,
    fundName,
    fundDescription,
    yieldText,
    price,
    tvl,
    chains,
    Button1Text,
    Button2Text,
    Button1Class,
    Button2Class,
    onButton1Click,
    onButton2Click,
    view,
  } = props;

  return (
    <div className="bg-primary flex justify-center items-center z-10 bg-hero-pattern bg-cover bg-center w-full ">
      <div className=" grid grid-cols-2 text-white w-full gap-5">
        <div className="flex flex-col ml-28   justify-center items-start mb-4">
          <div className={`flex justify-start items-center gap-x-2 mb-1 mt-5`}>
            <Image
              src={logoSrc}
              alt={altText}
              width={40}
              height={40}
              className="rounded-full"
            />
            <p className="uppercase text-4xl">{fundName}</p>
          </div>
          <p
            className={`${
              view === "Invest" ? "mb-5" : "mb-5"
            } text-sm opacity-80`}
          >
            {fundDescription}
          </p>
          <p
            className="lg:text-5xl text-3xl w-full text-pretty text-start mb-5 font-semibold"
            style={{ lineHeight: "1.2" }}
          >
            {yieldText}
            <span className="text-3xl align-top">*</span>
          </p>
          <div className="flex gap-x-2 ">
            <Button
              text={Button1Text}
              className={Button1Class}
              onClick={onButton1Click}
            />
            <Button
              text={Button2Text}
              className={Button2Class}
              onClick={onButton2Click}
            />
          </div>
          <div className="flex justify-between items-center pt-7 gap-x-8 gap-y-2">
            <div className="flex-col justify-start font-normal items-center text-light">
              <p className="opacity-70">Price</p>
              <h4 className="text-xl">${price}</h4>
            </div>
            <div className="flex-col justify-start items-center ">
              <p className="opacity-70">TVL</p>
              <p className="text-xl">${tvl}</p>
            </div>
            <div className="flex-col justify-start items-center ">
              <p className="opacity-70">Available on</p>
              <div className="flex justify-start items-center">{chains}</div>
            </div>
          </div>
        </div>
        <div className="text-white flex justify-center mt-10 mr-28">
          {view === "RedemptionList" && <RedemptionList />}
          {view === "PriceList" && <PriceList />}
          {view === "AllowList" && <AllowlistWallets />}
        </div>
      </div>
    </div>
  );
};

export default FundDetails;
