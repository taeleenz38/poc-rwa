"use client";

import React from "react";
import Button from "@/app/components/atoms/Buttons/Button";
import Skeleton from "react-loading-skeleton";
import BigNumber from "bignumber.js";

export interface Transaction {
  price: string | null;
  status: string;
  type: string;
  collateralType?: string;
  transactionDate: string;
  tokenAmount: string | null;
  stableAmount: string | null;
}

interface TransactionTableProps {
  transactions: Transaction[];
  fetchingTransactions: boolean;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

// Convert wei to ether
const weiToEther = (wei: string | number): string => {
  const weiBN = new BigNumber(wei);
  const etherBN = weiBN.dividedBy(new BigNumber(10).pow(18));
  return etherBN.toFixed();
};

// Format number with commas and fixed decimals
const formatNumber = (
  number: number | string,
  decimalPlaces: number = 2
): string => {
  const num = typeof number === "string" ? parseFloat(number) : number;
  return num.toLocaleString(undefined, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
};

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  fetchingTransactions,
  currentPage,
  totalPages,
  handlePageChange,
}) => {
  const sortedTransactions = transactions
    .slice()
    .sort(
      (a, b) =>
        new Date(b.transactionDate).getTime() -
        new Date(a.transactionDate).getTime()
    );

  const renderTransactionRow = (transaction: Transaction, index: number) => {
    const priceInUsd = transaction.price
      ? parseFloat(weiToEther(transaction.price))
      : null;

    const tokenName =
      priceInUsd !== null && priceInUsd < 10 ? "Velora" : "Equivest";

    return (
      <tr key={index} className="border-b borderColor">
        <td className="font-bold py-5">{tokenName}</td>
        <td className=" py-5">{transaction.status}</td>
        <td className=" py-5">
          {transaction.type} {transaction.collateralType}
        </td>
        <td className=" py-5">{transaction.transactionDate}</td>
        <td className=" py-5">
          {priceInUsd !== null ? `$${formatNumber(priceInUsd)}` : ""}
        </td>
        <td className=" py-5">
          {transaction.tokenAmount
            ? formatNumber(parseFloat(weiToEther(transaction.tokenAmount)))
            : ""}
        </td>
        <td className=" py-5">
          {transaction.stableAmount
            ? `$${formatNumber(
                parseFloat(weiToEther(transaction.stableAmount))
              )}`
            : ""}
        </td>
      </tr>
    );
  };

  return (
    <div className="flex flex-col w-full text-secondary overflow-y-scroll rounded-xl p-8 border-2 border-primary border-opacity-30 mt-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      <h2 className="flex font-bold text-2xl mb-8 justify-center text-secondary items-center">
        Transactions
      </h2>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="text-secondary bg-[#F5F2F2] border-none">
            <tr className="border-none">
              <th className="rounded-tl-xl">Token</th>
              <th>Status</th>
              <th>Type</th>
              <th>Date</th>
              <th>Token Price AUD</th>
              <th>Token Amount</th>
              <th className="rounded-tr-xl">Value AUD</th>
            </tr>
          </thead>
          <tbody>
            {fetchingTransactions ? (
              <tr className="border-none">
                <td colSpan={7} className="text-center py-4">
                  <Skeleton height={26} className="w-full" />
                </td>
              </tr>
            ) : sortedTransactions.length > 0 ? (
              sortedTransactions.map(renderTransactionRow)
            ) : (
              <tr className="border-none">
                <td colSpan={7} className="text-center py-4">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!fetchingTransactions && totalPages > 1 && (
        <div className="flex justify-between items-center mt-8">
          <Button
            text="Previous"
            className={`btn-sm items-center flex justify-center ${
              currentPage !== 1
                ? "bg-primary text-light hover:bg-secondary-focus font-semibold"
                : "bg-light cursor-not-allowed"
            }`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          <span>
            {currentPage} of {totalPages}
          </span>
          <Button
            text="Next"
            className={`py-2 btn-sm items-center flex justify-center ${
              currentPage !== totalPages
                ? "bg-primary text-light hover:bg-secondary-focus font-semibold"
                : "bg-light text-light cursor-not-allowed"
            }`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
