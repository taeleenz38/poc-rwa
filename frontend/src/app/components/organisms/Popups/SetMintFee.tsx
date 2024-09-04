"use client";
import { BigNumber } from "ethers";
import { useState, useEffect } from "react";
import InputField from "@/app/components/atoms/Inputs/TextInput";
import CloseButton from "@/app/components/atoms/Buttons/CloseButton";
import Submit from "@/app/components/atoms/Buttons/Submit";
import abi from "@/artifacts/ABBYManager.json";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { config } from "@/config";

interface SetMintFeeProps {
  isOpen: boolean;
  onClose: () => void;
}

const SetMintFee: React.FC<SetMintFeeProps> = ({ isOpen, onClose }) => {
  const [fee, setFee] = useState<string>("");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { writeContractAsync, isPending } = useWriteContract({ config });
  const [showLink, setShowLink] = useState(false);

  const resetForm = () => {
    setFee("");
    setTxHash(null);
    setError(null);
    setShowLink(false);
  };

  const onCloseModal = () => {
    onClose();
    resetForm();
  };

  const onFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFee(e.target.value);
  };

  const handleRequest = async () => {
    if (!fee) {
      setError("Please enter the fee.");
      return;
    }

    const feeInBigNumber = BigNumber.from(fee);

    try {
      const tx = await writeContractAsync({
        abi: abi.abi,
        address: process.env.NEXT_PUBLIC_AYF_MANAGER_ADDRESS as `0x${string}`,
        functionName: "setMintFee",
        args: [feeInBigNumber],
      });
      setTxHash(tx);
    } catch (error) {
      console.error(error);
    }
  };

  const { data, isLoading} =
  useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
  });


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="p-6 rounded-lg text-gray bg-white shadow-md shadow-white w-1/3">
        <div className="flex justify-between items-center mb-8">
          <div></div>
          <h2 className="text-2xl font-bold text-primary">Set Mint Fee</h2>
          <CloseButton onClick={onCloseModal} />
        </div>
        <div className="text-center px-8  mb-4 ">
          Please enter the new mint fee.
        </div>
        <div className="w-full text-center mx-auto mb-4">
          <InputField label="Fee:" value={fee || ""} onChange={onFeeChange} />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <div className="w-full flex justify-between">
          <div className="w-[49%]">
            <Submit
              onClick={onCloseModal}
              label={"Go Back"}
              disabled={isPending}
              className="w-full !bg-[#e6e6e6] !text-primary hover:!text-secondary"
            />
          </div>
          <div className="w-[49%]">
            <Submit
              onClick={handleRequest}
              label={isPending ? "Confirming..." : "Confirm"}
              disabled={isPending}
              className="w-full"
            />
          </div>
        </div>
        {isLoading && (
          <div className="mt-4 text-primary text-center overflow-x-scroll">
            {!showLink && <p> transaction is pending...</p>}
            {showLink && (
              <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline  overflow-x-scroll text-sm text-[#0000BF]"
              >
                View Transaction
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SetMintFee;
