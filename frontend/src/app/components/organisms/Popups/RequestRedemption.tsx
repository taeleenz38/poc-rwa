"use client";
import { BigNumber } from "ethers";
import { useState, useEffect } from "react";
import InputField from "@/app/components/atoms/Inputs/TextInput";
import CloseButton from "@/app/components/atoms/Buttons/CloseButton";
import Submit from "@/app/components/atoms/Buttons/Submit";
import abi from "@/artifacts/ABBYManager.json";
import ayfabi from "@/artifacts/ABBY.json";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { config } from "@/config";

interface RequestRedemptionProps {
  isOpen: boolean;
  onClose: () => void;
}

const RequestRedemption: React.FC<RequestRedemptionProps> = ({
  isOpen,
  onClose,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [txApprovalHash, setTxApprovalHash] = useState<string | null>(null);
  const [txRedemptionHash, setTxRedemptionHash] = useState<string | null>(null);
  const { writeContractAsync, isPending } = useWriteContract({ config });

  const resetForm = () => {
    setAmount("");
    setTxRedemptionHash(null);
    setTxApprovalHash(null);
  };

  const onCloseModal = () => {
    onClose();
    resetForm();
  };

  const onAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleRequestRedemption = async () => {
    try {
      const approvalAmount = BigNumber.from(amount).mul(
        BigNumber.from(10).pow(18)
      );
      const totalApprovalAmount = approvalAmount
        .mul(BigNumber.from(105))
        .div(BigNumber.from(100));

      const approvalTx = await writeContractAsync({
        abi: ayfabi.abi,
        address: process.env.NEXT_PUBLIC_AYF_ADDRESS as `0x${string}`,
        functionName: "approve",
        args: [
          process.env.NEXT_PUBLIC_AYF_MANAGER_ADDRESS as `0x${string}`,
          totalApprovalAmount,
        ],
      });

      setTxApprovalHash(approvalTx);
    } catch (error) {
      console.error("Error approving:", error);
    }
  };

  const { data: approvalReceipt, isLoading: isApprovalLoading } =
    useWaitForTransactionReceipt({
      hash: txApprovalHash as `0x${string}`,
    });

  useEffect(() => {
    if (approvalReceipt) {
      const requestRedemptionTransaction = async () => {
        try {
          const redemptionAmount = BigNumber.from(amount).mul(
            BigNumber.from(10).pow(18)
          );

          const redemptionTx = await writeContractAsync({
            abi: abi.abi,
            address: process.env
              .NEXT_PUBLIC_AYF_MANAGER_ADDRESS as `0x${string}`,
            functionName: "requestRedemption",
            args: [redemptionAmount],
          });

          setTxRedemptionHash(redemptionTx);
        } catch (error) {
          console.error("Error requesting redemption:", error);
        }
      };

      requestRedemptionTransaction();
    }
  }, [amount, writeContractAsync, approvalReceipt]);

  const { data: redemptionReceipt, isLoading: isRedemptionLoading } =
    useWaitForTransactionReceipt({
      hash: txRedemptionHash as `0x${string}`,
    });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="p-6 rounded-lg text-light bg-primary border-2 border-light shadow-md shadow-white w-1/4">
        <div className="flex justify-between items-center mb-8">
          <div></div>
          <h2 className="text-3xl font-bold">Redeem AYF For AUDC</h2>
          <CloseButton onClick={onCloseModal} />
        </div>
        <div className="text-center px-8 text-xl mb-4 font-medium">
          Please enter the amount of AYF you wish to redeem in return for AUDC.
        </div>
        <div className="w-full text-center mx-auto mb-8">
          <InputField
            label="AMOUNT:"
            value={amount || ""}
            onChange={onAmountChange}
          />
        </div>
        <div className="w-full flex justify-between">
          <div className="w-[49%]">
            <Submit
              onClick={onCloseModal}
              label={"Go Back"}
              disabled={isPending || isApprovalLoading || isRedemptionLoading}
              className="w-full !bg-[#e6e6e6] !text-primary hover:!text-secondary"
            />
          </div>
          <div className="w-[49%]">
            <Submit
              onClick={handleRequestRedemption}
              label={
                isPending || isApprovalLoading || isRedemptionLoading
                  ? "Confirming..."
                  : "Confirm"
              }
              disabled={isPending || isApprovalLoading || isRedemptionLoading}
              className="w-full"
            />
          </div>
        </div>
        {txApprovalHash && isApprovalLoading && (
          <div className="mt-4 text-white text-center">
            <p>Approval transaction is pending...</p>
          </div>
        )}
        {txRedemptionHash && (
          <div className="mt-4 text-white text-center">
            {isRedemptionLoading && <p>Redemption transaction is pending...</p>}
            {!isRedemptionLoading && (
              <p className="text-white overflow-x-scroll">
                Transaction successful! Hash: {txRedemptionHash}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestRedemption;
