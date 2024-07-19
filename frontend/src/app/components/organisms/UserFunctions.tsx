"use client";
import React, { useState } from "react";
import Button from "@/app/components/atoms/Buttons/Button";
import RequestDeposit from "@/app/components/organisms/Popups/RequestDeposit";
import RequestRedemption from "./Popups/RequestRedemption";

const UserFunctions = () => {
  const [isRequestDepositOpen, setIsRequestDepositOpen] = useState(false);
  const [isRequestRedemptionOpen, setIsRequestRedemptionOpen] = useState(false);
  return (
    <div className="w-full flex flex-col items-center pt-80">
      <Button
        onClick={() => {
          setIsRequestDepositOpen(true);
        }}
        text="Request Deposit"
        className="mb-5 w-72 font-semibold"
      />
      <RequestDeposit
        isOpen={isRequestDepositOpen}
        onClose={() => {
          setIsRequestDepositOpen(false);
        }}
      />
      <Button
        onClick={() => {
          setIsRequestRedemptionOpen(true);
        }}
        text="Request Redemption"
        className="mb-4 w-72 font-semibold"
      />
      <RequestRedemption
        isOpen={isRequestRedemptionOpen}
        onClose={() => {
          setIsRequestRedemptionOpen(false);
        }}
      />
    </div>
  );
};

export default UserFunctions;
