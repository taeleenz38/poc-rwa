"use client";
import { BigNumber, ethers } from "ethers";
import { useState, useEffect } from "react";
import InputField from "@/app/components/atoms/Inputs/TextInput";
import CloseButton from "@/app/components/atoms/Buttons/CloseButton";
import Submit from "@/app/components/atoms/Buttons/Submit";
import abi from "@/artifacts/ABBYManager.json";
import audcabi from "@/artifacts/AUDC.json";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { config } from "@/config";

interface ApproveRedeemProps {
  isOpen: boolean;
  onClose: () => void;
  redemptionId: string;
  redeemAmount: number;
}

const ApproveRedeem: React.FC<ApproveRedeemProps> = ({
  isOpen,
  onClose,
  redemptionId,
  redeemAmount,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [redemptionIdInput, setRedemptionIdInput] = useState<string>("");
  const [txApprovalHash, setTxApprovalHash] = useState<string | null>(null);
  const [txSecondHash, SetTxSecondHash] = useState<string | null>(null);
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
  };

  const onCloseModal = () => {
    onClose();
    resetForm();
  };

  const onAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const onRedemptionIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRedemptionIdInput(e.target.value);
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
          process.env.NEXT_PUBLIC_AYF_MANAGER_ADDRESS as `0x${string}`,
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
        address: process.env.NEXT_PUBLIC_AYF_MANAGER_ADDRESS as `0x${string}`,
        functionName: "approveRedemptionRequest",
        args: [[redemptionIdHexlified]],
      });

      setTxApprovalHash(approvalTx);
      SetTxSecondHash(tx);
    } catch (error) {
      console.error("Error approving:", error);
    }
  };

  const { data: approvalReceipt, isLoading: isApprovalLoading } =
    useWaitForTransactionReceipt({
      hash: txApprovalHash as `0x${string}`,
    });

  // useEffect(() => {
  //   // if (approvalReceipt) {
  //   const approveRedemptionRequest = async () => {
  //     try {
  //       const redemptionIdFormatted = Number(redemptionIdInput);
  //       const redemptionIdHexlified = ethers.utils.hexZeroPad(
  //         ethers.utils.hexlify(redemptionIdFormatted),
  //         32
  //       );

  //       const tx = await writeContractAsync({
  //         abi: abi.abi,
  //         address: process.env.NEXT_PUBLIC_AYF_MANAGER_ADDRESS as `0x${string}`,
  //         functionName: "approveRedemptionRequest",
  //         args: [[redemptionIdHexlified]],
  //       });

  //       SetTxSecondHash(tx);
  //     } catch (error) {
  //       console.error("Error requesting deposit:", error);
  //     }
  //   };

  //   approveRedemptionRequest();
  //   // }
  // }, [redemptionIdInput, writeContractAsync, approvalReceipt]);

  const { data: SecondReceipt, isLoading: isSecondLoading } =
    useWaitForTransactionReceipt({
      hash: txSecondHash as `0x${string}`,
    });

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
        <div className="text-center px-8  mb-8 ">
          Please enter the amount of AUDC you wish to approve for the AYF
          Manager to spend for a given redemption ID.
        </div>
        <div className="mb-4">
          <InputField
            label="Redemption ID:"
            value={redemptionIdInput}
            onChange={onRedemptionIdChange}
            className="w-full p-2 rounded-md"
          />
        </div>
        <div className="mb-8">
          <InputField
            label="Amount:"
            type="number"
            value={amount}
            onChange={onAmountChange}
            className="w-full p-2 rounded-md"
          />
        </div>
        <div className="w-full flex justify-between">
          <div className="w-[49%]">
            <Submit
              onClick={onCloseModal}
              label={"Go Back"}
              disabled={isPending || isApprovalLoading || isSecondLoading}
              className="w-full !bg-[#e6e6e6] !text-primary hover:!text-secondary"
            />
          </div>
          <div className="w-[49%]">
            <Submit
              label={isPending ? "Approving..." : "Approve Redeem"}
              onClick={handleApproveRedeem}
              disabled={isPending || isApprovalLoading || isSecondLoading}
              className="w-full"
            />
          </div>
        </div>
        {txSecondHash && (
          <div className="mt-4 text-primary text-center overflow-x-scroll">
            {isSecondLoading && (
              <p>Redemption approval transaction is pending...</p>
            )}
            {SecondReceipt && (
              <a
                href={`https://sepolia.etherscan.io/tx/${txSecondHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline overflow-x-scroll text-sm text-[#0000BF]"
              >
                Completed: View Transaction
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApproveRedeem;
