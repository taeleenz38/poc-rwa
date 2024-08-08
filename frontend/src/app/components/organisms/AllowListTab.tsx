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

import axios from "axios";
import AllowlistPopUp from "@/app/components/organisms/Popups/AllowlistPopUp";
import Button from "../atoms/Buttons/Button";
import RemoveAllowListPopUp from "./Popups/RemoveAllowListPopUp";

interface AccountStatusResponse {
  termIndex: string;
  account: string;
  status: boolean;
  date: string;
}

const AllowlistTab = () => {
  const [wallets, setWallets] = useState<AccountStatusResponse[]>([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [addAddreesOpen, setAddAddressOpen] = useState(false);
  const [removeAddressOprn, setRemoveAddressOpen] = useState(false);
  const [selectedAllowListIndex, setSelectedAllowListIndex] = useState<
    number | null
  >(null);

  const handleRadioChange = (index: number) => {
    if (index === selectedAllowListIndex) {
      //setSelectedPriceIndex(null);
    } else {
      setSelectedAllowListIndex(index);
    }
  };

  const fetchWallets = async () => {
    try {
      setIsTableLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/account-status`
      );
      setWallets(response.data);
    } catch (error) {
      console.error("Error fetching wallets:", error);
    } finally {
      setIsTableLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  if (isTableLoading) {
    return (
      <>
        <div
          className={`p-4 border-b-2  border-[#F5F2F2]bg-[#F5F2F2] border-b-[#ba745f] text-[#ba745f] bg-secondary/20 w-fit`}
        >
          Manage AllowList
        </div>
        <div className="flex justify-center items-center flex-col w-full p-10 border h-full">
          <div className=" text-base text-gray">AllowList Data Loading....</div>
        </div>
      </>
    );
  }

  return (
    <div>
      <div
        className={`p-4 border-b-2  border-[#F5F2F2]bg-[#F5F2F2] border-b-[#ba745f] text-[#ba745f] bg-secondary/20 w-fit`}
      >
        Manage AllowList
      </div>
      <div className="flex flex-col w-full border p-4">
        <div className="flex w-full justify-around items-center py-6">
          <Button
            text={"Add New Address"}
            onClick={() => setAddAddressOpen(true)}
            className="bg-primary py-2 text-light hover:bg-light hover:text-primary rounded-md"
          />
          <Button
            text={"Remove Address"}
            onClick={() => setRemoveAddressOpen(true)}
            className={`${
              selectedAllowListIndex === null
                ? `bg-gray/20 text-primary`
                : "bg-primary text-light hover:bg-light hover:text-primary"
            }  py-2  rounded-md`}
            disabled={selectedAllowListIndex === null}
          />
        </div>

        <div className="overflow-x-auto pt-4">
          <table className="table">
            <thead>
              <tr className="text-gray text-lg bg-[#F5F2F2] border-none ">
                <th className="text-center">ID#</th>
                <th className="text-center">User</th>
                <th className="text-center">Status</th>
                <th className="text-center">Transaction Date</th>
                <th className="text-center">Remove</th>
              </tr>
            </thead>
            <tbody>
              {wallets.map((wallet: AccountStatusResponse, index) => (
                <tr
                  className="border-b-2 border-[#F5F2F2] font-medium text-gray"
                  key={index}
                >
                  <td className="text-center">{wallet.termIndex}</td>
                  <td className="text-center">{wallet.account}</td>
                  <td className="text-center">
                    {wallet.status === true ? "Active" : "Paused"}
                  </td>
                  <td className="text-center">{wallet.date}</td>
                  <td className="text-center">
                    <div className="flex justify-center items-center ">
                      <input
                        type="radio"
                        name="AllowListSelection"
                        className="custom-checkbox"
                        checked={selectedAllowListIndex === index}
                        onChange={() => handleRadioChange(index)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <AllowlistPopUp
          isOpen={addAddreesOpen}
          onClose={() => setAddAddressOpen(false)}
        />
        <RemoveAllowListPopUp
          isOpen={removeAddressOprn}
          onClose={() => setRemoveAddressOpen(false)}
          walletAddress={wallets[selectedAllowListIndex as number]?.account}
        />
      </div>
    </div>
  );
};

export default AllowlistTab;
