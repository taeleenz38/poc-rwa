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

const AllowlistPopUp: React.FC<AllowlistProps> = ({ isOpen, onClose }) => {
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
      <div className="p-6 rounded-lg text-gray bg-white shadow-md shadow-white w-1/3">
        <div className="flex justify-between items-center mb-8">
          <div></div>
          <h2 className="text-3xl text-primary font-bold">
            Add User To Allowlist
          </h2>
          <CloseButton onClick={onCloseModal} />
        </div>
        <div className="text-center px-8 text-xl mb-4 font-medium">
          Please enter the wallet address of the user and term index you want to
          add to the allowlist.
        </div>
        <div className="w-full mx-auto mb-8">
          <InputField
            label="Wallet Address:"
            value={walletAddress || ""}
            onChange={onWalletAddressChange}
          />
        </div>
        <div className="w-full flex justify-between">
          <div className="w-[49%]">
            <Submit
              onClick={onCloseModal}
              label={"Go Back"}
              disabled={isPending || isLoading}
              className="w-full !bg-[#e6e6e6] !text-primary hover:!text-secondary"
            />
          </div>
          <div className="w-[49%]">
            <Submit
              onClick={handleAllowlist}
              label={isPending ? "Confirming..." : "Add User"}
              disabled={isPending || isLoading}
              className="w-full"
            />
          </div>
        </div>
        {txHash && (
          <div className="mt-4 text-primary text-center">
            {isLoading && <p>Transaction is pending...</p>}
            {receipt && (
              <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-primary overflow-x-scroll"
            >
              {txHash}
            </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllowlistPopUp;
