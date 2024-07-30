"use client";
import { ethers } from "ethers";
import { useState } from "react";
import InputField from "@/app/components/atoms/Inputs/TextInput";
import CloseButton from "@/app/components/atoms/Buttons/CloseButton";
import Submit from "@/app/components/atoms/Buttons/Submit";
import abi from "@/artifacts/IAllowlist.json";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { config } from "@/config";

interface SetValidTermIndexesProps {
  isOpen: boolean;
  onClose: () => void;
}

const SetValidTermIndexes: React.FC<SetValidTermIndexesProps> = ({
  isOpen,
  onClose,
}) => {
  const [validTermIndexes, setValidTermIndexes] = useState<number[]>([]);
  const [tx2Hash, setTx2Hash] = useState<string | null>(null);
  const { writeContractAsync, isPending } = useWriteContract({ config });

  const resetForm = () => {
    setValidTermIndexes([]);
    setTx2Hash(null);
  };

  const onCloseModal = () => {
    onClose();
    resetForm();
  };

  const onValidTermSetValidTermIndexesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    const indexes = value
      .split(",")
      .map((item) => parseInt(item.trim(), 10))
      .filter((item) => !isNaN(item));
    setValidTermIndexes(indexes);
  };

  const handleSetValidTermIndexes = async () => {
    try {
      const tx = await writeContractAsync({
        abi: abi.abi,
        address: process.env.NEXT_PUBLIC_ALLOWLIST_ADDRESS as `0x${string}`,
        functionName: "setValidTermIndexes",
        args: [validTermIndexes],
      });
      setTx2Hash(tx2Hash);
      console.log(
        "Successfully set valid term indexes - transaction hash:",
        tx
      );
    } catch (error) {
      console.error("Error setting valid term indexes:", error);
    }
  };

  const { data: receipt, isLoading } = useWaitForTransactionReceipt({
    hash: tx2Hash as `0x${string}`,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex justify-center items-center">
      <div className="p-6 rounded-lg shadow-md shadow-white w-1/4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">Set Valid Term Indexes</h2>
          <CloseButton onClick={onCloseModal} />
        </div>
        <InputField
          label="Valid Term Indexes:"
          value={validTermIndexes.join(", ")}
          onChange={onValidTermSetValidTermIndexesChange}
        />
        <div className="w-full flex justify-center">
          <Submit
            onClick={handleSetValidTermIndexes}
            label={isPending ? "Confirming..." : "Set"}
            disabled={isPending || isLoading}
          />
        </div>
        {tx2Hash && (
          <div className="mt-4 text-white">
            {isLoading && <p>Transaction is pending...</p>}
            {receipt && (
              <p className="text-white overflow-x-scroll">
                Transaction successful! Hash: {tx2Hash}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SetValidTermIndexes;
