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

interface UpdatePriceProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpdatePrice: React.FC<UpdatePriceProps> = ({ isOpen, onClose }) => {
  const [priceId, setPriceId] = useState<string>("");
  const [updatePrice, setUpdatePrice] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const { writeContractAsync, isPending } = useWriteContract({ config });

  const resetForm = () => {
    setPriceId("");
    setUpdatePrice("");
  };
  const onCloseModal = () => {
    onClose();
    resetForm();
  };

  const onPriceIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatePrice(e.target.value);
  };

  const onPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatePrice(e.target.value);
  };

  const handleUpdatePrice = async () => {
    const priceID = BigNumber.from(priceId);

    const price = BigNumber.from(updatePrice);
    try {
      const tx = await writeContractAsync({
        abi: abi.abi,
        address: process.env.NEXT_PUBLIC_PRICER_ADDRESS as `0x${string}`,
        functionName: "updatePrice",
        args: [priceID, price],
      });
      setTxHash(tx);
      console.log("Price successfully updated - transaction hash:", tx);
    } catch (error) {
      console.error("Error updating price:", error);
    }
  };

  const { data: receipt, isLoading } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="p-8 rounded-lg text-light bg-primary border-2 border-light shadow-md shadow-white w-1/4">
        <div className="flex justify-between items-center mb-8">
          <div></div>
          <h2 className="text-3xl font-bold">Update Price</h2>
          <CloseButton onClick={onCloseModal} />
        </div>
        <div className="text-center px-8 text-xl mb-4 font-medium">
          Please enter Price and Price ID for which you want to update.
        </div>
        <div className="w-full mx-auto mb-8">
          <InputField
            label="Price ID:"
            value={priceId || ""}
            onChange={onPriceIdChange}
          />{" "}
          <InputField
            label="Price:"
            value={updatePrice || ""}
            onChange={onPriceChange}
          />
        </div>
        <div className="w-full flex justify-between">
          <div className="w-[49%]">
            <Submit
              onClick={onCloseModal}
              label={"Go Back"}
              disabled={isPending || isLoading}
              className="w-full"
            />
          </div>
          <div className="w-[49%]">
            <Submit
              onClick={handleUpdatePrice}
              label={isPending ? "Confirming..." : "Confirm"}
              disabled={isPending || isLoading}
              className="w-full"
            />
          </div>
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

export default UpdatePrice;
