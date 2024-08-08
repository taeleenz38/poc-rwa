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

interface AccountStatusResponse {
  termIndex: string;
  account: string;
  status: boolean;
}

const Allowlist = () => {
  const [wallets, setWallets] = useState<AccountStatusResponse[]>([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [addAddreesOpen, setAddAddressOpen] = useState(false);

  useEffect(() => {
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

    fetchWallets();
  }, []);

  return (
    <div className="flex flex-col px-28  items-start w-full h-full pt-6 pb-6 ">
      <div className="flex flex-col gap-4">
        <h1 className="text-5xl font-semibold text-black ">Admin Requests</h1>
        <h2 className="text-2xl font-semibold text-gray mb-10">
          Track and manage your requests
        </h2>
      </div>

      <>
        <div
          className={`p-6 border-b-2  border-[#F5F2F2]bg-[#F5F2F2] border-b-[#ba745f] text-[#ba745f] bg-secondary/20`}
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
              text={"Update Existing Price ID"}
              onClick={() => {}}
              className="bg-primary py-2 text-light hover:bg-light hover:text-primary rounded-md"
              disabled
            />
          </div>

          <div className="overflow-x-auto pt-4">
            <table className="table">
              <thead>
                <tr className="text-gray text-lg bg-[#F5F2F2] border-none ">
                  <th className="text-center">ID#</th>
                  <th className="text-center">User</th>
                  <th className="text-center">Status</th>
                  {/* <th className="text-center">Transaction Date</th> */}
                  <th className="text-center">Update</th>
                </tr>
              </thead>
              <tbody>
                {isTableLoading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-10 font-medium text-gray text-center"
                    >
                      Loading data...
                    </td>
                  </tr>
                ) : !isTableLoading && wallets.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-10 font-medium text-gray text-center"
                    >
                      No wallet added to allowlist
                    </td>
                  </tr>
                ) : (
                  wallets.map((wallet: AccountStatusResponse) => (
                    <tr className="border-b-2 border-[#F5F2F2] font-medium text-gray">
                      <td className="text-center">{wallet.termIndex}</td>
                      <td className="text-center">{wallet.account}</td>
                      <td className="text-center">
                        {wallet.status === true ? "Active" : "Paused"}
                      </td>
                      {/* <td>Transaction Date</td> */}
                      <td className="text-center">
                        <div className="flex justify-center items-center ">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-secondary"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <AllowlistPopUp
            isOpen={addAddreesOpen}
            onClose={() => setAddAddressOpen(false)}
          />
        </div>
      </>
    </div>
  );
};

export default Allowlist;
