"use client";
import { BigNumber, ethers } from "ethers";
import { useState, useEffect } from "react";
import InputField from "@/app/components/atoms/Inputs/TextInput";
import CloseButton from "@/app/components/atoms/Buttons/CloseButton";
import Submit from "@/app/components/atoms/Buttons/Submit";
import abi from "@/artifacts/ABBYManager.json";
import audcabi from "@/artifacts/AUDC.json";
import { useWriteContract } from "wagmi";
import { config } from "@/config";

interface ApproveRedeemProps {
  isOpen: boolean;
  onClose: () => void;
  redemptionId: string;
  redeemAmount: number;
  tokenAmount: string;
}

const ApproveRedeem: React.FC<ApproveRedeemProps> = ({
  isOpen,
  onClose,
  redemptionId,
  redeemAmount,
  tokenAmount,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [redemptionIdInput, setRedemptionIdInput] = useState<string>("");
  const [txApprovalHash, setTxApprovalHash] = useState<string | null>(null);
  const [safeTxHash, setSafeTxHash] = useState<string>("");
  const { writeContractAsync, isPending } = useWriteContract({ config });

  useEffect(() => {
    if (redemptionId && redeemAmount) {
      setRedemptionIdInput(redemptionId);
      setAmount(redeemAmount.toString());
    }
  }, [redemptionId, redeemAmount]);

  const resetForm = () => {
    setAmount("");
    setTxApprovalHash(null);
    setSafeTxHash("");
  };

  const onCloseModal = () => {
    onClose();
    resetForm();
  };

  const handleApproveRedeem = async () => {
    try {
      const parsedAmount = parseFloat(amount);
      const approvalAmount = ethers.utils.parseUnits(
        parsedAmount.toString(),
        18
      );

      const approvalTx = await writeContractAsync({
        abi: audcabi.abi,
        address: process.env.NEXT_PUBLIC_AUDC_ADDRESS as `0x${string}`,
        functionName: "approve",
        args: [
          process.env.NEXT_PUBLIC_VLR_MANAGER_ADDRESS as `0x${string}`,
          approvalAmount,
        ],
      });

      const redemptionIdFormatted = Number(redemptionIdInput);
      const redemptionIdHexlified = ethers.utils.hexZeroPad(
        ethers.utils.hexlify(redemptionIdFormatted),
        32
      );

      const tx = await writeContractAsync({
        abi: abi.abi,
        address: process.env.NEXT_PUBLIC_VLR_MANAGER_ADDRESS as `0x${string}`,
        functionName: "approveRedemptionRequest",
        args: [[redemptionIdHexlified]],
      });

      setTxApprovalHash(approvalTx);
      setSafeTxHash(tx);
    } catch (error) {
      console.error("Error approving:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="p-6 rounded-lg text-gray bg-white shadow-md shadow-white w-1/3">
        <div className="flex justify-between items-center mb-8">
          <div></div>
          <h2 className="text-2xl font-bold text-primary">
            Approve Redemption
          </h2>
          <CloseButton onClick={onCloseModal} />
        </div>
        <div className="text-center px-8 mb-8">
          Please enter the amount of AUDC you wish to approve for the VLR
          Manager to spend for a given redemption ID.
        </div>
        <div className="mb-4">
          <InputField
            label="Redemption ID:"
            value={redemptionIdInput}
            onChange={(e) => setRedemptionIdInput(e.target.value)}
            className="w-full p-2 rounded-md"
          />
        </div>
        <div className="mb-8">
          <InputField
            label="Amount:"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 rounded-md"
          />
        </div>
        <div className="w-full flex justify-between">
          <div className="w-[49%]">
            <Submit
              onClick={onCloseModal}
              label={"Go Back"}
              disabled={isPending}
              className="w-full !bg-[#e6e6e6] !text-primary hover:!text-secondary"
            />
          </div>
          <div className="w-[49%]">
            <Submit
              label={isPending ? "Approving..." : "Approve Redeem"}
              onClick={handleApproveRedeem}
              disabled={isPending}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproveRedeem;
