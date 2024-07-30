"use client";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import InputField from "@/app/components/atoms/Inputs/TextInput";
import CloseButton from "@/app/components/atoms/Buttons/CloseButton";
import Submit from "@/app/components/atoms/Buttons/Submit";
import abi from "@/artifacts/IAllowlist.json";
import {
  useWriteContract,
  useSignMessage,
  useWaitForTransactionReceipt,
} from "wagmi";
import { config } from "@/config";

interface AllowlistProps {
  isOpen: boolean;
  onClose: () => void;
}

const Allowlist: React.FC<AllowlistProps> = ({ isOpen, onClose }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const { writeContractAsync, isPending } = useWriteContract({ config });

  const resetForm = () => {
    setWalletAddress(null);
    setTxHash(null);
  };
  const onCloseModal = () => {
    onClose();
    resetForm();
  };

  const onWalletAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWalletAddress(e.target.value);
  };

  const handleAllowlist = async () => {
    try {
      const tx = await writeContractAsync({
        abi: abi.abi,
        address: process.env.NEXT_PUBLIC_ALLOWLIST_ADDRESS as `0x${string}`,
        functionName: "setAccountStatus",
        args: [walletAddress as `0x${string}`, 0, true],
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
      <div className="p-6 rounded-lg text-light bg-primary border-2 border-light shadow-md shadow-white w-1/3">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl text-primary font-bold">Add User To Allowlist</h2>
          <CloseButton onClick={onCloseModal} />
        </div>
        <InputField
          label="Wallet Address:"
          value={walletAddress || ""}
          onChange={onWalletAddressChange}
        />
        <div className="w-full flex justify-end">
          <Submit
            onClick={handleAllowlist}
            label={isPending ? "Confirming..." : "Add User"}
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

export default Allowlist;
