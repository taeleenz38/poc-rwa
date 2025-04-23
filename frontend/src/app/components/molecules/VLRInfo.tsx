import React from "react";
import FundInfoCard from "./FundInfoCard";

const VLRInfo = () => {
  return (
    <div>
      <div className="text-center text-4xl mt-16 mb-12 font-medium text-secondary">
        Features
      </div>
      <div className="flex justify-evenly w-[1100px] gap-12 mb-12 mx-auto">
        <FundInfoCard
          src="/fees.png"
          title="Low Fees"
          description="Maximize your returns with minimal issuance and redemption costs"
        />
        <FundInfoCard
          src="/liquidity.png"
          title="Daily Liquidity"
          description="Access your capital with daily subscription and redemption"
        />
        <FundInfoCard
          src="/stability.png"
          title="Trusted AUD Exposure"
          description="Shield your investment with exposure to high-quality Australian cash assets"
        />
      </div>
      <div className="flex justify-evenly w-[1100px] gap-12 mb-16 mx-auto">
        <FundInfoCard
          src="/transparency.png"
          title="Blockchain Transparency"
          description="Track token pricing and NAV updates on-chain (real-time)"
        />
        <FundInfoCard
          src="/shield.png"
          title="Institutional-Grade Strategy"
          description="Invest in a fund managed by experienced professionals"
        />
        <FundInfoCard
          src="/yield.png"
          title="Auto-Compounding Yield"
          description="Watch your VLR token value grow"
        />
      </div>
    </div>
  );
};

export default VLRInfo;
