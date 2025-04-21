"use client";
import React, { useState } from "react";
import Image from "next/image";
import Button from "@/app/components/atoms/Buttons/Button";

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
  userStatus: "Active" | "Inactive";
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
    userStatus,
  } = props;

  return (
    <div
      className="flex justify-center items-center p-0 m-0 z-10"
      style={{
        backgroundImage: "url('/Graphic1.avif')",
        backgroundSize: "cover", // Ensures the image covers the container
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat", // No repeating background
        backgroundAttachment: "fixed", // Keeps the background fixed
        width: "100%", // Ensure full width
      }}
    >
      <div className="max-w-screen-xl h-full grid lg:grid-cols-2 grid-cols-1 pt-10 pb-10 px-8 font-normal text-light">
        <div className="grid col-span-1">
          <div className="flex justify-start items-center gap-x-2 mb-1">
            <Image
              src={logoSrc}
              alt={altText}
              width={40}
              height={40}
              className="rounded-full"
            />
            <p className="uppercase text-4xl">{fundName}</p>
          </div>
          <p className="mb-3 text-sm opacity-80">{fundDescription}</p>
          <p className="lg:text-5xl text-3xl mb-5 font-semibold mt-2">
            {yieldText}
            <span className="text-3xl align-top">*</span>
          </p>
          <div className="flex gap-x-2 mt-3">
            <Button
              text={Button1Text}
              className={Button1Class}
              onClick={onButton1Click}
              disabled={userStatus === "Inactive"}
            />
            <Button
              text={Button2Text}
              className={Button2Class}
              onClick={onButton2Click}
              disabled={userStatus === "Inactive"}
            />
          </div>
          <div className="flex items-center pt-14 gap-x-8 gap-y-2">
            <div className="flex-col justify-start font-normal items-center text-light">
              <p className="text-lg font-semibold opacity-70">Price</p>
              <h4 className="text-lg">${price}</h4>
            </div>
            <div className="flex-col justify-start items-center ">
              <p className=" text-lg opacity-70 font-semibold">NAV</p>
              <p className="text-lg">${tvl}</p>
            </div>
            <div className="flex-col justify-start items-center ">
              <p className=" text-lg opacity-70 font-semibold">Available on</p>
              <div className="flex justify-start items-center">{chains}</div>
            </div>
          </div>
        </div>
        <div className="grid col-span-1 ml-20">
          <div className="flex items-end text-base md:text-md text-right">
            <p>
              <b>VLR</b> is a tokenised fund and is designed for investors
              seeking a secure, liquid, and low-risk investment option. The Fund
              primarily invests in high-quality Australian bank bills and other
              short-term money market instruments. Its objective is to provide
              investors with a stable return while preserving capital and
              maintaining high liquidity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundDetails;
