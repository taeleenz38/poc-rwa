"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "../atoms/Buttons/Button";
import ApproveRedeem from "./Popups/ApproveRedeem";

interface RedemptionList {
  user: string;
  redemptionId: string;
  redeemAmount: number;
  rwaAmountIn: string;
}

const RedemptionApprovalTab = () => {
  const [wallets, setWallets] = useState<RedemptionList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [approveRedeem, setApproveRedeem] = useState(false);
  const [selectedRedemption, setSelectedRedemption] =
    useState<RedemptionList | null>(null);

  const handleRadioChange = (index: number) => {
    setSelectedRedemption(wallets[index]);
  };

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/pending-approval-redemption-list`
        );
        setWallets(response.data);
      } catch (error) {
        console.error("Error fetching wallets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWallets();
  }, []);

  if (isLoading) {
    return (
      <>
        <div className="p-4 border-b-2 border-[#F5F2F2] bg-[#F5F2F2] border-b-[#ba745f] text-[#ba745f] bg-secondary/20 w-fit">
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
      <div className="p-4 border-b-2 font-bold border-[#F5F2F2] bg-[#F5F2F2] border-b-[#ba745f] text-[#ba745f] bg-secondary/20 w-fit">
        Incoming Redemption Requests
      </div>
      <div className="flex flex-col w-full border p-4">
        <div className="flex w-full justify-around items-center py-6">
          <Button
            text={"Approve Redemption Request"}
            onClick={() => setApproveRedeem(true)}
            className={`bg-primary py-2 text-light hover:bg-light hover:text-primary rounded-md ${
              !selectedRedemption && "bg-white text-primary cursor-not-allowed"
            }`}
            disabled={!selectedRedemption}
          />
          <Button
            text={"Reject Redemption Request"}
            onClick={() => ""}
            className={`bg-primary py-2 text-light hover:bg-light hover:text-primary rounded-md ${
              true && "bg-white text-primary cursor-not-allowed"
            }`}
            disabled={true}
          />
        </div>

        <div className="overflow-x-auto pt-4">
          <table className="table">
            <thead>
              <tr className="text-gray text-lg bg-[#F5F2F2] border-none ">
                <th className="text-center">Redemption ID</th>
                <th className="text-center">User</th>
                <th className="text-center">Redeem Amount</th>
                <th className="text-center">RWA Burned</th>
                <th className="text-center">Select</th>
              </tr>
            </thead>
            <tbody>
              {wallets.map((wallet: RedemptionList, index) => (
                <tr
                  className="border-b-2 border-[#F5F2F2] font-medium text-gray"
                  key={index}
                >
                  <td className="text-center">{wallet.redemptionId}</td>
                  <td className="text-center">{wallet.user}</td>
                  <td className="text-center">{wallet.redeemAmount} AUDC</td>
                  <td className="text-center">{wallet.rwaAmountIn} AYF</td>
                  <td className="text-center">
                    <div className="flex justify-center items-center">
                      <input
                        type="radio"
                        name="RedemptionSelection"
                        className="custom-checkbox"
                        checked={selectedRedemption === wallets[index]}
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
          redemptionId={selectedRedemption?.redemptionId || ""}
          redeemAmount={selectedRedemption?.redeemAmount || 0}
        />
      </div>
    </div>
  );
};

export default RedemptionApprovalTab;
