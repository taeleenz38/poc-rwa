import React from "react";
import Image from "next/image";
import {
  BaseIcon,
  EthIcon,
  SolanaIcon,
  MoonbeamIcon,
  LiquidIcon,
} from "@/app/components/atoms/Icons";

const FundDetails = () => {
  return (
    <div className="bg-[#122A5F] flex justify-center items-center">
      <div className="max-w-screen-xl h-full bg-hero-pattern bg-no-repeat bg-right-bottom bg-70% grid lg:grid-cols-2 grid-cols-1 pt-20 pb-36 px-8 font-normal text-light bg-url('/assets/ABBY-background.svg')">
        <div className="grid col-span-1 ">
          <div className="flex justify-start items-center gap-x-2 mb-1">
            <Image src={"/LOGO.png"} alt="image" width={50} height={50} className="rounded-full" />
            <p className="uppercase  text-3xl">ABBY</p>
          </div>
          <p className="mb-3 text-sm opacity-80">
            Copiam Australian Dollar Yield
          </p>
          <p className="lg:text-6xl text-4xl mb-5">
            Stable, high-quality Australian Dollar yield
            <span className="text-3xl align-top">*</span>
          </p>
          <div className="flex justify-start items-center gap-x-2 ">
            {/* <Button variant="secondary" className="py-2 px-3">
            Buy ABBY
          </Button>
          <Button variant="ghost" className="py-2 px-3">
            Redeem ABBY
          </Button> */}
          </div>
          <div className="flex flex-wrap justify-start items-center pt-14 gap-x-8 gap-y-2">
            <div className="flex-col justify-start font-normal items-center text-light">
              <p className="opacity-70">Price</p>
              <h4 className="text-3xl">$1.0445</h4>
            </div>

            <div className="flex-col justify-start items-center">
              <p className="opacity-70">APY</p>
              <p className="text-3xl">5.30%</p>
            </div>

            <div className="flex-col justify-start items-center ">
              <p className="opacity-70">TVL</p>
              <p className="text-3xl">$327.50M</p>
            </div>

            <div className="flex-col justify-start items-center ">
              <p className="opacity-70">Available on</p>
              <div className="flex justify-start items-center">
                <EthIcon className="lg:w-8 lg:h-8" />
                <SolanaIcon className="lg:w-8 lg:h-8" />
                <LiquidIcon className="lg:w-8 lg:h-8" />
                <BaseIcon className="lg:w-8 lg:h-8" />
                <MoonbeamIcon className="lg:w-8 lg:h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundDetails;
