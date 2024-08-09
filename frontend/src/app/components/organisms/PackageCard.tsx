import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";

import { IoArrowForwardSharp } from "react-icons/io5";

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

  useEffect(() => {
    const fetchPriceId = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/price-list`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("price data", data);

        // Find the latest price based on the date
        const latestPrice = data.sort(
          (a: Item, b: Item) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];

        // Update the state with the latest price
        setPrice(latestPrice ? latestPrice.price : "Loading Price...");
      } catch (error) {
        console.error("Error fetching price ID:", error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchPriceId();
  }, []);

  const formattedPrice = price
    ? parseFloat(price).toFixed(2)
    : "Loading Price...";

  return (
    <Link href={href}>
      <div
        className="rounded-xl bg-primary opacity-100 text-light flex flex-col justify-between h-96 p-2 max-w-2xl mt-10 hover:opacity-90 hover:cursor-pointer shadow-black shadow-md transition-transform duration-500 hover:scale-105 "
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
            <h1 className=" font-medium text-4xl">${formattedPrice}</h1>
          </div>
          <div className="flex flex-col gap-y-3 md:flex-row gap-x-2 justify-between ">
            <div className="flex flex-col gap-y-2  md:flex-row gap-x-2">
              <div className="bg-light rounded-full py-1.5 px-3 text-black flex justify-center items-center text-base">
                <p>{TVL} TVL</p>
              </div>
              <div className="bg-light rounded-full py-1.5 px-3 flex items-center">
                {chains}
              </div>
              <div className="border-2 rounded-full py-1.5 px-3 bg-transparent text-light text-sm font-medium flex justify-center items-center ">
                <p className="line-clamp-1">{footerText}</p>
              </div>
            </div>
            <div className="border-2 w-10 h-10 rounded-full ml-28 flex justify-center items-center ">
              <IoArrowForwardSharp />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
