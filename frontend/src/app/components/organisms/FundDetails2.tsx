"use client";
import React, { useState } from "react";
import Image from "next/image";
import Button from "@/app/components/atoms/Buttons/Button";
import RequestDeposit from "@/app/components/organisms/Popups/RequestDeposit";
import RequestRedemption from "@/app/components/organisms/Popups/RequestRedemption";
import Allowlist from "@/app/components/organisms/Popups/Allowlist";
import AddTermAndSetValidTermIndexes from "@/app/components/organisms/Popups/AddTermAndSetValidTermIndexes";
import PriceList from "../molecules/PriceList";

type FundDetails2Props = {
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
};

const FundDetails2 = (props: FundDetails2Props) => {
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
  } = props;

  return (
    <div className="bg-primary flex justify-center items-center z-10">
      <div className="max-w-screen-xl h-full bg-right-bottom bg-70% grid lg:grid-cols-2 grid-cols-1 pt-20 pb-36 px-8 font-normal text-light">
        <div className="grid col-span-1 ">
          <div className="flex justify-start items-center gap-x-2 mb-1">
            <Image
              src={logoSrc}
              alt={altText}
              width={50}
              height={50}
              className="rounded-full"
            />
            <p className="uppercase text-5xl">{fundName}</p>
          </div>
          <p className="mb-3 text-sm opacity-80">{fundDescription}</p>
          <p className="lg:text-6xl text-4xl mb-5">
            {yieldText}
            <span className="text-3xl align-top">*</span>
          </p>
          <div className="flex gap-x-2 mt-3">
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
          <div className="flex justify-between items-center pt-14 gap-x-8 gap-y-2">
            <div className="flex-col justify-start font-normal items-center text-light">
              <p className="opacity-70">Price</p>
              <h4 className="text-3xl">{price}</h4>
            </div>
            <div className="flex-col justify-start items-center ">
              <p className="opacity-70">TVL</p>
              <p className="text-3xl">{tvl}</p>
            </div>
            <div className="flex-col justify-start items-center ">
              <p className="opacity-70">Available on</p>
              <div className="flex justify-start items-center">{chains}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundDetails2;
