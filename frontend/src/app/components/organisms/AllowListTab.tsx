"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "../atoms/Buttons/Button";
import AllowlistPopUp from "@/app/components/organisms/Popups/AllowlistPopUp";
import RemoveAllowListPopUp from "./Popups/RemoveAllowListPopUp";

interface AccountStatusResponse {
  termIndex: string;
  account: string;
  status: boolean;
  date: string;
}

const ITEMS_PER_PAGE = 6; // Number of items per page

const AllowlistTab = () => {
  const [wallets, setWallets] = useState<AccountStatusResponse[]>([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [addAddressOpen, setAddAddressOpen] = useState(false);
  const [removeAddressOpen, setRemoveAddressOpen] = useState(false);
  const [selectedAllowListIndex, setSelectedAllowListIndex] = useState<
    number | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.ceil(wallets.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const paginatedWallets = wallets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isTableLoading) {
    return (
      <>
        <div
          className={`p-4 border-b-2 border-[#F5F2F2] bg-[#F5F2F2] border-b-[#ba745f] text-[#ba745f] bg-secondary/20 w-fit`}
        >
          Manage AllowList
        </div>
        <div className="flex justify-center items-center flex-col w-full p-10 border h-full">
          <div className="text-base text-gray">AllowList Data Loading....</div>
        </div>
      </>
    );
  }

  return (
    <div>
      <div
        className={`p-4 border-b-2 font-bold border-[#F5F2F2] bg-[#F5F2F2] border-b-[#ba745f] text-[#ba745f] bg-secondary/20 w-fit`}
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
            } py-2 rounded-md`}
            disabled={selectedAllowListIndex === null}
          />
        </div>

        <div className="overflow-x-auto pt-4">
          <table className="table w-full">
            <thead>
              <tr className="text-gray text-sm bg-[#F5F2F2] border-none">
                <th className="text-center">Term Index</th>
                <th className="text-center">User</th>
                <th className="text-center">Status</th>
                <th className="text-center">Transaction Date</th>
                <th className="text-center">Remove</th>
              </tr>
            </thead>
            <tbody>
              {paginatedWallets.map((wallet: AccountStatusResponse, index) => (
                <tr
                  className="border-b-2 border-[#F5F2F2] font-medium text-gray"
                  key={index}
                >
                  <td className="text-center text-sm">{wallet.termIndex}</td>
                  <td className="text-center text-sm">{wallet.account}</td>
                  <td className="text-center text-sm">
                    {wallet.status ? "Active" : "Paused"}
                  </td>
                  <td className="text-center text-sm">{wallet.date}</td>
                  <td className="text-center text-sm">
                    <div className="flex justify-center items-center">
                      <input
                        type="radio"
                        name="AllowListSelection"
                        className="custom-checkbox text-sm"
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

        <div className="flex w-1/3 mx-auto justify-between items-center mt-8">
          <button
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-light text-primary"
            }`}
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? "bg-primary text-light"
                    : "bg-light text-primary"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-light text-primary"
            }`}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        <AllowlistPopUp
          isOpen={addAddressOpen}
          onClose={() => setAddAddressOpen(false)}
        />
        <RemoveAllowListPopUp
          isOpen={removeAddressOpen}
          onClose={() => setRemoveAddressOpen(false)}
          walletAddress={wallets[selectedAllowListIndex as number]?.account}
        />
      </div>
    </div>
  );
};

export default AllowlistTab;
