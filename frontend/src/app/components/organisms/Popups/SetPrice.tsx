"use client";
import { BigNumber } from "ethers";
import { useState, useEffect } from "react";
import InputField from "@/app/components/atoms/Inputs/TextInput";
import CloseButton from "@/app/components/atoms/Buttons/CloseButton";
import Submit from "@/app/components/atoms/Buttons/Submit";
import abi from "@/artifacts/Pricer.json";
import {
  useWriteContract,
  useSignMessage,
  useWaitForTransactionReceipt,
} from "wagmi";
import { config } from "@/config";

interface AddPriceProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddPrice: React.FC<AddPriceProps> = ({ isOpen, onClose }) => {
  const [addPrice, setAddPrice] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const { writeContractAsync, isPending } = useWriteContract({ config });

  const resetForm = () => {
    setAddPrice("");
  };
  const onCloseModal = () => {
    onClose();
    resetForm();
  };

  const onPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddPrice(e.target.value);
  };

  const handleAddPrice = async () => {
    const price = BigNumber.from(addPrice).mul(BigNumber.from(10).pow(18));
    const timestamp = BigNumber.from(Math.floor(Date.now() / 1000));
    try {
      const tx = await writeContractAsync({
        abi: abi.abi,
        address: process.env.NEXT_PUBLIC_PRICER_ADDRESS as `0x${string}`,
        functionName: "addPrice",
        args: [price, timestamp],
      });
      setTxHash(tx);
      console.log("Price successfully added - transaction hash:", tx);
    } catch (error) {
      console.error("Error adding price:", error);
    }
  };

  const { data: receipt, isLoading } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="p-8 rounded-lg text-gray bg-white shadow-md shadow-white w-1/3">
        <div className="flex justify-between items-center mb-8">
          <div></div>
          <h2 className="text-2xl font-bold text-primary">Add Price</h2>
          <CloseButton onClick={onCloseModal} />
        </div>
        <div className="text-center px-8 l mb-4 ">
          Please enter the desired price for AYF (Australian Yield Fund).
        </div>
        <div className="w-full mx-auto mb-8">
          <InputField
            label="Price:"
            value={addPrice || ""}
            onChange={onPriceChange}
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
              onClick={handleAddPrice}
              label={isPending ? "Confirming..." : "Confirm"}
              disabled={isPending || isLoading}
              className="w-full"
            />
          </div>
        </div>
        {txHash && (
          <div className="mt-4 text-primary overflow-x-scroll">
            {isLoading && <p>Transaction is pending...</p>}
            {receipt && (
              <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline  overflow-x-scroll text-sm text-[#0000BF]"
              >
                view transaction
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddPrice;
