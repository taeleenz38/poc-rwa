"use client";
import { BigNumber } from "ethers";
import { useState, useEffect } from "react";
import InputField from "@/app/components/atoms/Inputs/TextInput";
import CloseButton from "@/app/components/atoms/Buttons/CloseButton";
import Submit from "@/app/components/atoms/Buttons/Submit";
import abi from "@/artifacts/ABBYManager.json";
import audcabi from "@/artifacts/AUDC.json";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { config } from "@/config";

interface RequestDepositProps {
  isOpen: boolean;
  onClose: () => void;
}

const RequestDeposit: React.FC<RequestDepositProps> = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState<string>("");
  const [txApprovalHash, setTxApprovalHash] = useState<string | null>(null);
  const [txDepositHash, setTxDepositHash] = useState<string | null>(null);
  const { writeContractAsync, isPending } = useWriteContract({ config });

  const resetForm = () => {
    setAmount("");
    setTxDepositHash(null);
    setTxApprovalHash(null);
  };

  const onCloseModal = () => {
    onClose();
    resetForm();
  };

  const onAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleRequestDeposit = async () => {
    try {
      const approvalAmount = BigNumber.from(amount).mul(
        BigNumber.from(10).pow(18)
      );

      const approvalTx = await writeContractAsync({
        abi: audcabi.abi,
        address: process.env.NEXT_PUBLIC_AUDC_ADDRESS as `0x${string}`,
        functionName: "approve",
        args: [
          process.env.NEXT_PUBLIC_AYF_MANAGER_ADDRESS,
          approvalAmount,
        ],
      });

      setTxApprovalHash(approvalTx);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Wait for the approval transaction to be mined
  const { data: approvalReceipt, isLoading: isApprovalLoading } =
    useWaitForTransactionReceipt({
      hash: txApprovalHash as `0x${string}`,
    });

  useEffect(() => {
    if (approvalReceipt) {
      const requestDepositTransaction = async () => {
        try {
          const depositAmount = BigNumber.from(amount).mul(
            BigNumber.from(10).pow(18)
          );

          const depositTx = await writeContractAsync({
            abi: abi.abi,
            address: process.env
              .NEXT_PUBLIC_AYF_MANAGER_ADDRESS as `0x${string}`,
            functionName: "requestSubscription",
            args: [depositAmount],
          });

          setTxDepositHash(depositTx);
        } catch (error) {
          console.error("Error requesting deposit:", error);
        }
      };

      requestDepositTransaction();
    }
  }, [amount, writeContractAsync, approvalReceipt]);

  const { data: depositReceipt, isLoading: isDepositLoading } =
    useWaitForTransactionReceipt({
      hash: txDepositHash as `0x${string}`,
    });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="p-6 rounded-lg text-light bg-primary border-2 border-light shadow-md shadow-white w-1/3">
        <div className="flex justify-between items-center mb-8">
          <div></div>
          <h2 className="text-3xl font-bold">Buy AYF</h2>
          <CloseButton onClick={onCloseModal} />
        </div>
        <div className="text-center px-8 text-xl mb-4 font-medium">
          Please enter the amount of AUDC you wish to deposit in return for AYF.
        </div>
        <div className="w-full text-center mx-auto mb-8">
          <InputField
            label="Amount:"
            value={amount || ""}
            onChange={onAmountChange}
          />
        </div>
        <div className="w-full flex justify-between">
          <div className="w-[49%]">
            <Submit
              onClick={onCloseModal}
              label={"Go Back"}
              disabled={isPending || isApprovalLoading || isDepositLoading}
              className="w-full !bg-[#e6e6e6] !text-primary hover:!text-secondary"
            />
          </div>
          <div className="w-[49%]">
            <Submit
              onClick={handleRequestDeposit}
              label={
                isPending || isApprovalLoading || isDepositLoading ? "Confirming..." : "Confirm"
              }
              disabled={isPending || isApprovalLoading || isDepositLoading}
              className="w-full"
            />
          </div>
        </div>
        {txApprovalHash && isApprovalLoading && (
          <div className="mt-4 text-white text-center">
            <p>Approval transaction is pending...</p>
          </div>
        )}
        {txDepositHash && (
          <div className="mt-4 text-white text-center">
            {isDepositLoading && <p>Deposit transaction is pending...</p>}
            {!isDepositLoading && (
              <p className="text-white overflow-x-scroll">
                Transaction successful! Hash: {txDepositHash}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestDeposit;
