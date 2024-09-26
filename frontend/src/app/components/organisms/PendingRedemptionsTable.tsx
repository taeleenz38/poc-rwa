import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useQuery } from "urql";
import { useAccount, useBalance, useWriteContract } from "wagmi";
import BigNumber from "bignumber.js";
import Button from "@/app/components/atoms/Buttons/Button";

type ClaimableAUDCToken = {
  user: string;
  id: string;
  rwaAmountIn: string;
  priceId: string;
  redeemAmount: number;
  redemptionId: string;
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

const PendingRedemptionsTable = ({
  tokens,
  isFetching,
  claimRedemption,
  type, // "AYF" or "HYF"
}: {
  tokens: ClaimableAUDCToken[];
  isFetching: boolean;
  claimRedemption: (id: string) => void;
  type: "AUDC" | "USDC";
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead className="text-primary bg-[#F5F2F2] border-none">
          <tr className="border-none">
            <th className="flex-1">Redeem Amount</th>
            <th className="flex-1">Claimable Amount</th>
            <th className="flex-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isFetching ? (
            <tr className="border-none">
              <td colSpan={3} className="text-center py-4 border-none">
                <Skeleton height={26} className="w-full" />
              </td>
            </tr>
          ) : tokens.length === 0 ? (
            <tr className="border-none">
              <td colSpan={3} className="text-center py-4 border-none">
                No claimable tokens found
              </td>
            </tr>
          ) : (
            tokens.map((token) => (
              <tr className="border-b borderColor" key={token.id}>
                <td className="flex-1">
                  {formatNumber(
                    weiToEther(token.rwaAmountIn as unknown as number)
                  )}{" "}
                  AYF
                </td>
                <td className="flex-1">
                {formatNumber(
                    weiToEther(token.redeemAmount as unknown as number)
                  )}{" "}
                  {type === "AUDC" ? "AUDC" : "USDC"}
                </td>
                <td className="flex-1">
                  <Button
                    text="Claim"
                    className={`py-2 btn-sm items-center flex justify-center ${
                      true
                        ? "bg-[#e6e6e6] text-primary hover:bg-light hover:text-secondary font-semibold"
                        : "bg-[#e6e6e6] text-light cursor-not-allowed"
                    }`}
                    onClick={() => claimRedemption(token.redemptionId)}
                    disabled={false}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PendingRedemptionsTable;
