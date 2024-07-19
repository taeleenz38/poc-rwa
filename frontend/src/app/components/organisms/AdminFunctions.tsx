"use client";
import React, { useState } from "react";
import Button from "@/app/components/atoms/Buttons/Button";
import Allowlist from "@/app/components/organisms/Popups/Allowlist";
import SetPrice from "@/app/components/organisms/Popups/SetPrice";

const AdminFunctions = () => {
  const [isAllowlistOpen, setIsAllowlistOpen] = useState(false);
  const [isSetPriceOpen, setIsSetPriceOpen] = useState(false);
  return (
    <div className="w-full flex flex-col items-center pt-80">
      <Button
        onClick={() => {
          setIsAllowlistOpen(true);
        }}
        text="Add User To Allowlist"
        className="mb-5 w-72 font-semibold"
      />
      <Allowlist
        isOpen={isAllowlistOpen}
        onClose={() => {
          setIsAllowlistOpen(false);
        }}
      />
      <Button
        onClick={() => {
          setIsSetPriceOpen(true);
        }}
        text="Set Price"
        className="mb-4 w-72 font-semibold"
      />
      <SetPrice
        isOpen={isSetPriceOpen}
        onClose={() => {
          setIsSetPriceOpen(false);
        }}
      />
    </div>
  );
};

export default AdminFunctions;
