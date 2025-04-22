import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import abi from "@/artifacts/ABBY.json";
import { config } from "@/config";
import axios from "axios";
import { IoArrowForwardSharp } from "react-icons/io5";
import { BigNumber, ethers } from "ethers";

interface Item {
  date: string;
}

type PackageCardProps = {
  href: string;
  backgroundImage: string;
  heading: string;
  subHeading: string;
  PRICE: string;
  TVL: string;
  footerText: string;
  chains: React.ReactNode;
  imageSrc: string;
};

export const PackageCard = (props: PackageCardProps) => {
  const [isFetching, setIsFetching] = useState(true);
  const [tvl, setTvl] = useState<string | null>(null);
  const [price, setPrice] = useState<string | null>(null);
  const {
    href,
    backgroundImage,
    heading,
    subHeading,
    PRICE,
    TVL,
    footerText,
    chains,
    imageSrc,
  } = props;

  return (
    <div
      className="w-[350px] md:w-[500px] rounded-xl bg-primary text-white flex flex-col justify-between h-80 p-3 max-w-2xl mt-4 shadow-black shadow-md transition-transform duration-500"
      style={{
        backgroundImage,
        backgroundPosition: "left",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col">
        <div className="flex items-center space-x-3">
          <Image
            src={imageSrc}
            alt="image"
            width={50}
            height={50}
            className="rounded-xl"
          />
          <div>
            <p className="font-semibold text-xl">{heading}</p>
          </div>
        </div>
        <p className="font-medium mt-3">{subHeading}</p>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="flex items-end">
          <h1 className="font-medium text-4xl mr-6">${PRICE}</h1>
        </div>
        <div className="flex flex-col gap-y-3 md:flex-row gap-x-2 justify-between ">
          <div className="flex flex-col gap-y-2  md:flex-row gap-x-2">
            <div className="bg-white text-black rounded-xl py-1.5 px-3 flex justify-center items-center text-base">
              <p>${TVL} NAV</p>
            </div>
            <div className="bg-white rounded-xl py-1.5 px-3 flex justify-center items-center">
              {chains}
            </div>
          </div>
        </div>
      </div>
      <Link href={href}>
        <div className="rounded-xl py-2 bg-primary text-md font-medium text-center hover:bg-secondary-focus duration-500">
          <p className="line-clamp-1">{footerText}</p>
        </div>
      </Link>
    </div>
  );
};
