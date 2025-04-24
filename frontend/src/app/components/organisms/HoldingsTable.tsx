"use client";

import React from "react";
import Skeleton from "react-loading-skeleton";
import Image from "next/image";

interface HoldingsTableProps {
  isFetching: boolean;
  vlrPrice: string | number;
  formattedVlrBalance: number;
  vlrMarketValueInEther: number;
  eqvPrice: string | number;
  formattedEqvBalance: number;
  eqvMarketValueInEther: number;
}

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

const HoldingsTable: React.FC<HoldingsTableProps> = ({
  isFetching,
  vlrPrice,
  formattedVlrBalance,
  vlrMarketValueInEther,
  eqvPrice,
  formattedEqvBalance,
  eqvMarketValueInEther,
}) => {
  return (
    <div className="flex flex-col w-full text-secondary overflow-y-scroll rounded-xl border-2 border-primary border-opacity-30 p-12 mt-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      <h2 className="flex font-bold text-2xl mb-8 justify-center items-center text-secondary">
        Holdings
      </h2>
      <div className="overflow-x-auto">
        <table className="table w-full rounded-xl">
          <thead className="text-secondary bg-[#F5F2F2]">
            <tr className="border-none text-md">
              <th className="rounded-tl-xl">Token</th>
              <th>Token Price AUD</th>
              <th>Position</th>
              <th className="rounded-tr-xl">Market Value - AUD</th>
            </tr>
          </thead>

          <tbody>
            {isFetching ? (
              <tr className="border-none">
                <td colSpan={4} className="text-center py-4">
                  <Skeleton height={26} className="w-full" />
                </td>
              </tr>
            ) : (
              <>
                <tr className="border-b borderColor text-md">
                  <td className="flex items-center py-8 gap-4">
                    <Image
                      src="/VLR.jpg"
                      alt="velora logo"
                      width={50}
                      height={50}
                      className="rounded-xl"
                    />
                    <b>Velora</b>
                  </td>
                  <td className="py-8">${vlrPrice}</td>
                  <td className="py-8">{formatNumber(formattedVlrBalance)}</td>
                  <td className="py-8">
                    ${formatNumber(vlrMarketValueInEther)}
                  </td>
                </tr>
                <tr className="border-b borderColor text-md">
                  <td className="flex items-center py-8 gap-4">
                    <Image
                      src="/EQV.png"
                      alt="equivest logo"
                      width={50}
                      height={50}
                      className="rounded-xl"
                    />
                    <b>Equivest</b>
                  </td>
                  <td className="py-8">${eqvPrice}</td>
                  <td className="py-8">{formatNumber(formattedEqvBalance)}</td>
                  <td className="py-8">
                    ${formatNumber(eqvMarketValueInEther)}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HoldingsTable;
