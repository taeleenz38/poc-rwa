import React from "react";
import Image from "next/image";
import Button from "@/app/components/atoms/Buttons/Button";

type FundDetailsAdminProps = {
  logoSrc: string;
  altText: string;
  fundName: string;
  fundDescription: string;
  yieldText: string;
  price: string;
  tvl: string;
  chains: React.ReactNode;
};

const FundDetailsAdmin = (props: FundDetailsAdminProps) => {
  const {
    logoSrc,
    altText,
    fundName,
    fundDescription,
    yieldText,
    price,
    tvl,
    chains,
  } = props;

  return (
    <div className="bg-[#122A5F] flex justify-center items-center">
      <div className="max-w-screen-xl h-full bg-hero-pattern bg-no-repeat bg-right-bottom bg-70% grid lg:grid-cols-2 grid-cols-1 pt-20 pb-36 px-8 font-normal text-light bg-url('/assets/ABBY-background.svg')">
        <div className="grid col-span-1">
          <div className="flex justify-start items-center gap-x-2 mb-1">
            <Image
              src={logoSrc}
              alt={altText}
              width={50}
              height={50}
              className="rounded-full"
            />
            <p className="uppercase text-3xl">{fundName}</p>
          </div>
          <p className="mb-3 text-sm opacity-80">{fundDescription}</p>
          <p className="lg:text-6xl text-4xl mb-5">
            {yieldText}
            <span className="text-3xl align-top">*</span>
          </p>
          <div className="flex gap-x-2 mt-3">
            <Button
              text="Set Price"
              className="bg-light text-primary hover:bg-primary hover:text-light"
            />
            <Button
              text="Update Price ID"
              className="bg-[#122A5F] text-light hover:bg-primary"
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

export default FundDetailsAdmin;
