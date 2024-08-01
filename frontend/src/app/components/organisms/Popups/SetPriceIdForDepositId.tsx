"use client";
import { BigNumber, ethers } from "ethers";
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

interface SetPriceIdForDepositIdProps {
  isOpen: boolean;
  onClose: () => void;
}

const SetPriceIdForDepositId: React.FC<SetPriceIdForDepositIdProps> = ({
  isOpen,
  onClose,
}) => {
  const [depositId, setDepositId] = useState<string>("");
  const [priceId, setPriceId] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const { writeContractAsync, isPending } = useWriteContract({ config });

  const resetForm = () => {
    setDepositId("");
    setPriceId("");
  };

  const onCloseModal = () => {
    onClose();
    resetForm();
  };

  const onPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceId(e.target.value);
  };

  const onDepositIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepositId(e.target.value);
  };

  const handleSetPriceIdForDepositId = async () => {
    const depositIdFormatted = Number(depositId);
    const depositIdHexlified = ethers.utils.hexZeroPad(ethers.utils.hexlify(depositIdFormatted), 32);
    const price = BigNumber.from(priceId);
    console.log("Setting priceId for depositId:", depositIdHexlified, price);
    try {
      const tx = await writeContractAsync({
        abi: abi.abi,
        address: process.env.NEXT_PUBLIC_AYF_MANAGER_ADDRESS as `0x${string}`,
        functionName: "setPriceIdForDeposits",
        args: [[depositIdHexlified], [price]],
      });
      setTxHash(tx);
      console.log("Price Id Successfully Set - transaction hash:", tx);
    } catch (error) {
      console.error("Error setting priceId:", error);
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
          <h2 className="text-xl font-bold">Set Price Id For Deposit Id</h2>
          <CloseButton onClick={onCloseModal} />
        </div>
        <InputField
          label="Deposit Id:"
          value={depositId || ""}
          onChange={onDepositIdChange}
        />
        <InputField
          label="Price Id:"
          value={priceId || ""}
          onChange={onPriceChange}
        />
        <div className="w-full flex justify-end">
          <Submit
            onClick={handleSetPriceIdForDepositId}
            label={isPending ? "Confirming..." : "Confirm"}
            disabled={isPending || isLoading}
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

export default SetPriceIdForDepositId;
