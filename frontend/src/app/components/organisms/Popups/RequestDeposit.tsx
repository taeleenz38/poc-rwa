"use client";
import { BigNumber } from "ethers";
import { useState, useEffect } from "react";
import InputField from "@/app/components/atoms/Inputs/TextInput";
import CloseButton from "@/app/components/atoms/Buttons/CloseButton";
import Submit from "@/app/components/atoms/Buttons/Submit";
import abi from "@/artifacts/ABBYManager.json";
import {
  useWriteContract,
  useSignMessage,
  useWaitForTransactionReceipt,
} from "wagmi";
import { config } from "@/config";

interface RequestDepositProps {
  isOpen: boolean;
  onClose: () => void;
}

const RequestDeposit: React.FC<RequestDepositProps> = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState<string>("");
  const [txHash, setTxHash] = useState<string | null>(null);
  const { writeContractAsync, isPending } = useWriteContract({ config });

  const resetForm = () => {
    setAmount("");
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
      const depositAmount = BigNumber.from(amount);

      const tx = await writeContractAsync({
        abi: abi.abi,
        address: process.env.NEXT_PUBLIC_AYF_MANAGER_ADDRESS as `0x${string}`,
        functionName: "requestSubscription",
        args: [depositAmount],
      });

      setTxHash(tx);
      console.log("Deposit successfully requested - transaction hash:", tx);
    } catch (error) {
      console.error("Error requesting deposit:", error);
    }
  };
  const { data: receipt, isLoading } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="p-6 rounded-lg text-light bg-primary border-2 border-light shadow-md shadow-white w-1/3">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">Buy AYF</h2>
          <CloseButton onClick={onCloseModal} />
        </div>
        <InputField
          label="AMOUNT:"
          value={amount || ""}
          onChange={onAmountChange}
        />
        <div className="w-full flex justify-center">
          <Submit
            onClick={handleRequestDeposit}
            label={isPending ? "Confirming..." : "Buy"}
            disabled={isPending}
          />
        </div>
        {txHash && (
          <div className="mt-4 text-white">
            {isLoading && <p>Transaction is pending...</p>}
            {receipt && (
              <p className="text-white overflow-x-scroll">
                Transaction successful! Hash: {txHash}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestDeposit;
