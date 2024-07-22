"use client";
import { useState } from "react";
import InputField from "@/app/components/atoms/Inputs/TextInput";
import CloseButton from "@/app/components/atoms/Buttons/CloseButton";
import Submit from "@/app/components/atoms/Buttons/Submit";
import abi from "../../../../../../blockchain/artifacts/contracts/interfaces/IAllowlist.sol/IAllowlist.json";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { config } from "@/config";

interface AddTermProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTerm: React.FC<AddTermProps> = ({ isOpen, onClose }) => {
  const [term, setTerm] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const { writeContractAsync, isPending } = useWriteContract({ config });

  const resetForm = () => {
    setTerm(null);
    setTxHash(null);
  };

  const onCloseModal = () => {
    onClose();
    resetForm();
  };

  const onTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
  };

  const handleAddTerm = async () => {
    try {
      const tx = await writeContractAsync({
        abi: abi.abi,
        address: process.env.NEXT_PUBLIC_ALLOWLIST_ADDRESS as `0x${string}`,
        functionName: "addTerm",
        args: [term],
      });
      setTxHash(tx);
      console.log("Term successfully added - transaction hash:", tx);
    } catch (error) {
      console.error("Error adding term to allowlist:", error);
    }
  };

  const { data: receipt, isLoading } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex justify-center items-center">
      <div className="p-6 rounded-lg shadow-md shadow-white w-1/4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">Add Term To Allowlist</h2>
          <CloseButton onClick={onCloseModal} />
        </div>
        <InputField label="Term:" value={term || ""} onChange={onTermChange} />
        <div className="w-full flex justify-center">
          <Submit
            onClick={handleAddTerm}
            label={isPending ? "Confirming..." : "Add Term"}
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

export default AddTerm;
