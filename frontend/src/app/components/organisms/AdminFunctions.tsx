"use client";
import React, { useState } from "react";
import Button from "@/app/components/atoms/Buttons/Button";
import AddTerm from "@/app/components/organisms/Popups/AddTerm";
import SetValidTermIndexes from "@/app/components/organisms/Popups/SetValidTermIndexes";
import Allowlist from "@/app/components/organisms/Popups/Allowlist";
import SetPrice from "@/app/components/organisms/Popups/SetPrice";

const AdminFunctions = () => {
  const [isAddTermOpen, setIsAddTermOpen] = useState(false);
  const [isSetValidTermIndexesOpen, setIsSetValidTermIndexesOpen] =
    useState(false);
  const [isAllowlistOpen, setIsAllowlistOpen] = useState(false);
  const [isSetPriceOpen, setIsSetPriceOpen] = useState(false);
  return (
    <div className="w-full flex flex-col items-center pt-96">
      <Button
        onClick={() => {
          setIsAddTermOpen(true);
        }}
        text="Add Term To Allowlist"
        className="mb-5 w-72 font-semibold"
      />
      <AddTerm
        isOpen={isAddTermOpen}
        onClose={() => {
          setIsAddTermOpen(false);
        }}
      />
      <Button
        onClick={() => {
          setIsSetValidTermIndexesOpen(true);
        }}
        text="Set Valid Term Indexes"
        className="mb-5 w-72 font-semibold"
      />
      <SetValidTermIndexes
        isOpen={isSetValidTermIndexesOpen}
        onClose={() => {
          setIsSetValidTermIndexesOpen(false);
        }}
      />
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
