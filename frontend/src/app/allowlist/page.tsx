"use client";
import React, { useEffect, useState } from "react";
import FundDetails from "@/app/components/organisms/FundDetails";
import AddTermAndSetValidTermIndexes from "@/app/components/organisms/Popups/AddTermAndSetValidTermIndexes";
import AddToList from "@/app/components/organisms/Popups/AllowlistPopUp";
import AllowlistWallets from "@/app/components/organisms/AllowlistWallets";
import {
  BaseIcon,
  EthIcon,
  SolanaIcon,
  MoonbeamIcon,
  LiquidIcon,
} from "@/app/components/atoms/Icons";
import Button from "../components/atoms/Buttons/Button";
import axios from "axios";
import AllowlistPopUp from "@/app/components/organisms/Popups/AllowlistPopUp";
import AllowlistTab from "../components/organisms/AllowListTab";

const Allowlist = () => {
  return (
    <div className="min-h-screen root-container">
      <h1 className="text-4xl font-semibold text-black mb-4">
        AllowList Management
      </h1>
      <h2 className="text-xl font-normal text-black mb-12">
        Manage list of all allowed users
      </h2>
      <AllowlistTab />
      {/* <PricingSection /> */}
    </div>
  );
};

export default Allowlist;
