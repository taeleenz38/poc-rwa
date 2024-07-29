"use client";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import { useAccount } from "wagmi";
import { config } from "@/config";
import { PackageCard } from "./components/organisms/PackageCard";
import {
  BaseIcon,
  EthIcon,
  SolanaIcon,
  MoonbeamIcon,
  LiquidIcon,
} from "@/app/components/atoms/Icons";

export default function Home() {
  return (
    <main className="h-screen bg-light px-96 text-black">
      <h1 className="text-5xl font-semibold pt-14 w-3/5">
        Institutional-Grade FX and Debt Liquidity, bridging TradFi and DeFi.
      </h1>
      <h2 className="text-xl mt-10 w-1/2">
        Copiam is bridging the next generation of financial infrastructure in
        DeFi with access to the deepest, most efficient institutional FX and
        capital markets in TradFi.
      </h2>
      <div className="flex p-2 mt-10">
        <PackageCard
          heading="AYF"
          subHeading="Australian Dollar Yield"
          PRICE="1.048"
          TVL="$327.50M"
          href="/invest"
          backgroundImage="url('/background.svg')"
          footerText="For Wholesale Investors"
          chains={
            <>
              <BaseIcon />
              <EthIcon />
              <SolanaIcon />
              <MoonbeamIcon />
              <LiquidIcon />
            </>
          }
        />
      </div>
    </main>
  );
}
