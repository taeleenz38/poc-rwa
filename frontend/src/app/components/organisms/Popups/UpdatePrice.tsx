"use client";
import { BigNumber, ethers } from "ethers";
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
  priceId: string;
}

const UpdatePrice: React.FC<UpdatePriceProps> = ({
  isOpen,
  onClose,
  priceId,
}) => {
  const [updatePrice, setUpdatePrice] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const { writeContractAsync, isPending } = useWriteContract({ config });

  const resetForm = () => {
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
    const priceID = Number(priceId);
    const priceIDHexlified = ethers.utils.hexZeroPad(
      ethers.utils.hexlify(priceID),
      32
    );

    const price = BigNumber.from(updatePrice).mul(BigNumber.from(10).pow(18));

    console.log("priceID", priceID.toString());
    console.log("price", price.toString());
    try {
      const tx = await writeContractAsync({
        abi: abi.abi,
        address: process.env.NEXT_PUBLIC_PRICER_ADDRESS as `0x${string}`,
        functionName: "updatePrice",
        args: [priceIDHexlified, price],
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
      <div className="p-8 rounded-lg text-gray bg-white shadow-md shadow-white w-1/3">
        <div className="flex justify-between items-center mb-8">
          <div></div>
          <h2 className="text-3xl font-bold text-primary">Update Price</h2>
          <CloseButton onClick={onCloseModal} />
        </div>
        <div className="text-center px-8 text-xl mb-4 font-medium">
          Please enter Price and Price ID for which you want to update.
        </div>
        <div className="w-full mx-auto mb-8">
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
              className="w-full !bg-[#e6e6e6] !text-primary hover:!text-secondary"
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
          <div className="mt-4 text-primary text-center">
            {isLoading && <p>Transaction is pending...</p>}
            {receipt && (
              <p className="text-primary overflow-x-scroll">
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
