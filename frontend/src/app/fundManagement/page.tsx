"use client";
import React, { useState } from "react";
import FundManagement from "@/app/components/organisms/FundManagement";

const Page = () => {
  const [view, setView] = useState<"VLR" | "EQV">("VLR");

  return (
    <div className="min-h-screen root-container">
      <div className="flex justify-between items-center">
        <div className="">
          <h1 className="text-4xl font-semibold text-secondary mb-4">
            Fund Management
          </h1>
          <h2 className="text-xl font-normal text-secondary mb-8">
            Track and manage all available funds
          </h2>
        </div>
        <div className="flex justify-end">
          <select
            value={view}
            onChange={(e) => setView(e.target.value as "VLR" | "EQV")}
            className="px-2 py-2 rounded-xl text-sm md:text-base text-primary focus:outline-none"
          >
            <option value="VLR">VLR</option>
            <option value="EQV">EQV</option>
          </select>
        </div>
      </div>
      <FundManagement view={view} />
    </div>
  );
};

export default Page;
