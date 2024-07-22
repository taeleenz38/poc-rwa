"use client";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import InputField from "@/app/components/atoms/Inputs/TextInput";
import CloseButton from "@/app/components/atoms/Buttons/CloseButton";
import Submit from "@/app/components/atoms/Buttons/Submit";
import {
  useWriteContract,
  useSignMessage,
  useWaitForTransactionReceipt,
} from "wagmi";
import { config } from "@/config";

interface RequestRedemptionProps {
  isOpen: boolean;
  onClose: () => void;
}

const RequestRedemption: React.FC<RequestRedemptionProps> = ({ isOpen, onClose }) => {
  const [onchainId, setOnchainId] = useState<string | null>(null);
  const { writeContractAsync, isPending } = useWriteContract({ config });

  const resetForm = () => {
    setOnchainId(null);
  };
  const onCloseModal = () => {
    onClose();
    resetForm();
  };

  const onOnchainIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOnchainId(e.target.value);
  };

  const handleRequestRedemption = async () => {
    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex justify-center items-center">
      <div className="p-6 rounded-lg shadow-md shadow-white w-1/4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">Request Deposit</h2>
          <CloseButton onClick={onCloseModal} />
        </div>
        <InputField
          label="ONCHAIN-ID:"
          value={onchainId || ""}
          onChange={onOnchainIdChange}
        />
        <div className="w-full flex justify-center">
          <Submit
            onClick={handleRequestRedemption}
            label={isPending ? "Confirming..." : "Redeem"}
            disabled={isPending}
          />
        </div>
      </div>
    </div>
  );
};

export default RequestRedemption;
