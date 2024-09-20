import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useQuery } from "urql";
import { useAccount, useBalance, useWriteContract } from "wagmi";
import BigNumber from "bignumber.js";
import Button from "@/app/components/atoms/Buttons/Button";

type ClaimableToken = {
  user: string;
  id: string;
  collateralAmountDeposited: string;
  depositAmountAfterFee: string;
  feeAmount: string;
  claimableTimestamp: string;
  claimTimestampFromChain: number;
  priceId: string;
  claimableAmount?: number;
};

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

const PendingTokensTable = ({
  tokens,
  isFetching,
  claimMint,
  claimRedemption,
  type,
}: {
  tokens: ClaimableToken[];
  isFetching: boolean;
  claimMint: (id: string) => void;
  claimRedemption?: (id: string) => void;
  type: "AYF" | "HYF";
}) => {
  return (
    <div className="overflow-x-auto border-none">
      <table className="table w-full border-none">
        <thead className="text-primary bg-[#F5F2F2] border-none">
          <tr className="border-none">
            <th>Deposit Amount After Fee</th>
            <th>Request Date</th>
            <th>Claimable Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isFetching ? (
            <tr className="border-none">
              <td colSpan={4} className="py-4">
                <Skeleton height={26} className="w-full" />
              </td>
            </tr>
          ) : tokens.length === 0 ? (
            <tr className="border-none">
              <td colSpan={4} className="text-center py-4">
                No pending requests found
              </td>
            </tr>
          ) : (
            tokens.map((token) => {
              const isClaimable =
                Date.now() >= new Date(token.claimableTimestamp).getTime();

              return (
                <tr className="border-b borderColor" key={token.id}>
                  <td>
                    {formatNumber(weiToEther(token.depositAmountAfterFee))} AUDC
                  </td>
                  <td>{new Date(token.claimableTimestamp).toLocaleString()}</td>
                  <td>
                    {formatNumber(weiToEther(token.claimableAmount ?? 0))} AYF
                  </td>

                  <td>
                    <Button
                      text="Claim"
                      className={`py-2 btn-sm items-center flex justify-center ${
                        isClaimable
                          ? "bg-[#e6e6e6] text-primary hover:bg-light hover:text-secondary font-semibold"
                          : "bg-[#e6e6e6] text-light cursor-not-allowed"
                      }`}
                      onClick={() => claimMint(token.id)}
                      disabled={!isClaimable}
                    />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PendingTokensTable;
