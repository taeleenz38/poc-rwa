"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "../atoms/Buttons/Button";
import ApproveRedeem from "./Popups/ApproveRedeem";
import { GET_PENDING_APPROVAL_REDEMPTION_LIST } from "@/lib/urqlQueries";
import { ethers } from "ethers";
import { useQuery } from "urql";

type RedemptionListData = {
  redemptionRequests: {
    id: string;
    redemptionId: string;
    user: string;
    rwaAmountIn: string;
    redeemAmount: number;
    displayId: string;
    collateralType: string;
    tokenAmount: string;
  }[];
};

const RedemptionApprovalTab = () => {
  const [wallets, setWallets] = useState<RedemptionListData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [approveRedeem, setApproveRedeem] = useState(false);
  const [selectedRedemption, setSelectedRedemption] = useState<{
    id: string;
    redemptionId: string;
    user: string;
    rwaAmountIn: string;
    redeemAmount: number;
    displayId: string;
    collateralType: string;
    tokenAmount: string;
  } | null>(null);

  const [{ data, fetching, error }] = useQuery<RedemptionListData>({
    query: GET_PENDING_APPROVAL_REDEMPTION_LIST,
  });

  const handleRadioChange = (index: number) => {
    setSelectedRedemption(data?.redemptionRequests[index] || null);
  };

  if (isLoading) {
    return (
      <>
        <div className="p-4 border-b-2 border-[#F5F2F2] bg-[#F5F2F2] border-b-primary text-primary w-fit">
          Incoming Redemption Requests
        </div>
        <div className="flex justify-center items-center flex-col w-full p-10 border h-full">
          <div className="text-base text-gray">
            Redemption Requests Loading....
          </div>
        </div>
      </>
    );
  }

  return (
    <div>
      <div className="p-4 border-b-2 font-bold border-[#F5F2F2] bg-[#F5F2F2] border-b-primary text-primary rounded-t-xl w-fit">
        Incoming Redemption Requests
      </div>
      <div className="flex flex-col w-full border-2 border-primary border-opacity-30 rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-tl-none p-4">
        <div className="flex w-full justify-around items-center py-6">
          <Button
            text={"Approve Redemption Request"}
            onClick={() => setApproveRedeem(true)}
            className={`bg-primary py-2 text-light hover:bg-secondary-focus hover:text-white rounded-md ${
              !selectedRedemption && "bg-white text-secondary cursor-not-allowed"
            }`}
            disabled={!selectedRedemption}
          />
          <Button
            text={"Reject Redemption Request"}
            onClick={() => ""}
            className={`bg-primary py-2 text-light hover:bg-secondary-focus hover:text-white rounded-md ${
              true && "bg-white text-secondary cursor-not-allowed"
            }`}
            disabled={true}
          />
        </div>

        <div className="overflow-x-auto pt-4">
          <table className="table">
            <thead>
              <tr className="text-gray text-sm font-semibold bg-[#F5F2F2] border-none ">
                <th className="text-center">Redemption ID</th>
                <th className="text-center">User</th>
                <th className="text-center">Redeem Amount</th>
                <th className="text-center">RWA Amount</th>
                <th className="text-center">Select</th>
              </tr>
            </thead>
            <tbody>
              {data?.redemptionRequests.map((request, index) => (
                <tr
                  className="border-b-2 border-[#F5F2F2] text-sm text-gray"
                  key={index}
                >
                  <td className="text-center py-6">
                    {(() => {
                      const [hexPart, token] = request.displayId.split("-");
                      const decimalNumber = parseInt(hexPart, 16);
                      return `${decimalNumber}-${token}`;
                    })()}
                  </td>
                  <td className="text-center py-6">{request.user}</td>
                  <td className="text-center py-6">
                    {ethers.utils.formatUnits(request.redeemAmount, 18)}{" "}
                    {request.collateralType === "AUDC" ? "AUDC" : "USDC"}
                  </td>
                  <td className="text-center py-6">
                    {" "}
                    {ethers.utils.formatUnits(request.rwaAmountIn, 18)} VLR
                  </td>
                  <td className="text-center py-6">
                    <div className="flex justify-center items-center">
                      <input
                        type="radio"
                        name="RedemptionSelection"
                        className="custom-checkbox"
                        checked={
                          selectedRedemption?.displayId === request.displayId
                        }
                        onChange={() => handleRadioChange(index)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ApproveRedeem
          isOpen={approveRedeem}
          onClose={() => setApproveRedeem(false)}
          redemptionId={
            selectedRedemption?.redemptionId
              ? parseInt(selectedRedemption.redemptionId, 16).toString()
              : ""
          }
          tokenAmount={selectedRedemption?.tokenAmount || ""}
          redeemAmount={
            selectedRedemption?.redeemAmount
              ? parseFloat(
                  ethers.utils.formatUnits(selectedRedemption.redeemAmount, 18)
                )
              : 0
          }
        />
      </div>
    </div>
  );
};

export default RedemptionApprovalTab;
