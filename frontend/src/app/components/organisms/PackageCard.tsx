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
  } = props;

  return (
    <Link href={href}>
      <div
        className="rounded-xl bg-primary opacity-100 text-light flex flex-col justify-between h-80 p-2 max-w-2xl mt-4 hover:opacity-90 hover:cursor-pointer shadow-black shadow-md transition-transform duration-500 hover:scale-105 "
        style={{
          backgroundImage,
          backgroundPosition: "left",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex space-x-3">
          <Image
            src={"/LOGO.png"}
            alt="image"
            width={50}
            height={50}
            className="rounded-full"
          />
          <div>
            <p className="font-semibold text-xl">{heading}</p>
            <p className="font-medium">{subHeading}</p>
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <div>
            <h1 className=" font-medium text-4xl">${PRICE}</h1>
          </div>
          <div className="flex flex-col gap-y-3 md:flex-row gap-x-2 justify-between ">
            <div className="flex flex-col gap-y-2  md:flex-row gap-x-2">
              <div className="bg-light rounded-full py-1.5 px-3 text-black flex justify-center items-center text-base">
                <p>${TVL} TVL</p>
              </div>
              <div className="bg-light rounded-full py-1.5 px-3 flex justify-center items-center">
                {chains}
              </div>
              <div className="border-2 rounded-full py-1.5 px-3 bg-transparent text-light text-sm font-medium flex justify-center items-center ">
                <p className="line-clamp-1">{footerText}</p>
              </div>
            </div>
            <div className="border-2 w-10 h-10 rounded-full ml-0 md:ml-28 flex justify-center items-center ">
              <IoArrowForwardSharp />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
