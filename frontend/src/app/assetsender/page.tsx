"use client";

import { useState } from "react";
import RedemptionApprovalTab from "@/app/components/organisms/RedemptionApprovalTab";

const AssetSender = () => {
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const handleButton1Click = () => {
    setIsApproveOpen(true);
  };

  return (
    <div className="min-h-screen root-container">
      <h1 className="text-4xl font-semibold text-black mb-4">
        Redemption Approval
      </h1>
      <h2 className="text-xl font-normal text-gray mb-12">
        Manage incoming redemption requests from users
      </h2>
      <RedemptionApprovalTab />
    </div>
  );
};

export default AssetSender;
