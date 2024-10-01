"use client";
import { useState } from "react";
import InputField from "@/app/components/atoms/Inputs/TextInput";
import CloseButton from "@/app/components/atoms/Buttons/CloseButton";
import Submit from "@/app/components/atoms/Buttons/Submit";
import abi from "@/artifacts/IAllowlist.json";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { config } from "@/config";

interface AddTermProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTerm: React.FC<AddTermProps> = ({ isOpen, onClose }) => {
  const [term, setTerm] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const {
    writeContractAsync: writeAddTermContractAsync,
    isPending: isAddTermPending,
  } = useWriteContract({ config });

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
      const tx = await writeAddTermContractAsync({
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
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="p-6 rounded-lg text-gray bg-white shadow-md shadow-white w-1/3">
        <div className="flex justify-between items-center mb-8">
          <div></div>
          <h2 className="text-2xl font-bold text-primary">Add Term</h2>
          <CloseButton onClick={onCloseModal} />
        </div>
        <div className="text-center px-8  mb-4 ">
          Please enter the term you wish to add.
        </div>
        <div className="w-full text-center mx-auto mb-4">
          <InputField
            label="Term:"
            value={term || ""}
            onChange={onTermChange}
          />
        </div>
        <div className="w-full flex justify-between">
          <div className="w-[49%]">
            <Submit
              onClick={onCloseModal}
              label={"Go Back"}
              disabled={isLoading}
              className="w-full !bg-[#e6e6e6] !text-primary hover:!text-secondary"
            />
          </div>
          <div className="w-[49%]">
            <Submit
              onClick={handleAddTerm}
              label={isAddTermPending ? "Confirming..." : "Add Term"}
              disabled={isAddTermPending || isLoading}
              className="w-full"
            />
          </div>
        </div>
        {txHash && (
          <div className="mt-4 text-white mb-4">
            {isLoading && <p>Transaction is pending...</p>}
            {receipt && (
              <p className="text-primary text-center overflow-x-scroll">
                Transaction successful! {txHash}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddTerm;
