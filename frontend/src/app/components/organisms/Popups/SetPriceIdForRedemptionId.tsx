"use client";
import { BigNumber, ethers } from "ethers";
import { useState, useEffect } from "react";
import InputField from "@/app/components/atoms/Inputs/TextInput";
import CloseButton from "@/app/components/atoms/Buttons/CloseButton";
import Submit from "@/app/components/atoms/Buttons/Submit";
import abi from "@/artifacts/ABBYManager.json";
import {
  useWriteContract,
  useSignMessage,
  useWaitForTransactionReceipt,
} from "wagmi";
import { config } from "@/config";

interface SetPriceIdForRedemptionIdProps {
  isOpen: boolean;
  onClose: () => void;
  redemptionId?: string;
}

interface PricingResponse {
  priceId: string;
  price: string;
  status: string;
  date: string;
}

const SetPriceIdForRedemptionId: React.FC<SetPriceIdForRedemptionIdProps> = ({
  isOpen,
  onClose,
  redemptionId = "",
}) => {
  const [localRedemptionId, setLocalRedemptionId] =
    useState<string>(redemptionId);
  const [priceId, setPriceId] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const { writeContractAsync, isPending } = useWriteContract({ config });

  useEffect(() => {
    setLocalRedemptionId(redemptionId);
  }, [redemptionId]);

  const resetForm = () => {
    setLocalRedemptionId("");
    setPriceId("");
  };

  const onCloseModal = () => {
    onClose();
    resetForm();
  };

  const onPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceId(e.target.value);
  };

  const onRedemptionIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalRedemptionId(e.target.value);
  };

  const handleSetPriceIdForRedemptionId = async () => {
    const redemptionIdFormatted = Number(localRedemptionId);
    const redemptionIdHexlified = ethers.utils.hexZeroPad(
      ethers.utils.hexlify(redemptionIdFormatted),
      32
    );
    const price = BigNumber.from(priceId);
    console.log(
      "Setting priceId for redemptionId:",
      redemptionIdHexlified,
      price
    );
    try {
      const tx = await writeContractAsync({
        abi: abi.abi,
        address: process.env.NEXT_PUBLIC_AYF_MANAGER_ADDRESS as `0x${string}`,
        functionName: "setPriceIdForRedemptions",
        args: [[redemptionIdHexlified], [price]],
      });
      setTxHash(tx);
      console.log("Price Id Successfully Set - transaction hash:", tx);
    } catch (error) {
      console.error("Error setting priceId:", error);
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
          <h2 className="text-3xl font-bold text-primary">
            Set Price ID For Redemption ID
          </h2>
          <CloseButton onClick={onCloseModal} />
        </div>
        <div className="text-center px-8 text-xl mb-4 font-medium">
          Please enter the Redemption ID and the Price ID you want to set it
          for.
        </div>
        <div className="w-full mx-auto mb-8">
          <InputField
            label="Redemption ID:"
            value={redemptionId || ""}
            onChange={onRedemptionIdChange}
          />
          <InputField
            label="Price ID:"
            value={priceId || ""}
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
              onClick={handleSetPriceIdForRedemptionId}
              label={isPending ? "Confirming..." : "Confirm"}
              disabled={isPending || isLoading}
              className="w-full"
            />
          </div>
        </div>
        {txHash && (
          <div className="mt-4 text-white text-center">
            {isLoading && <p>Transaction is pending...</p>}
            {!isLoading && (
              <p className="text-white overflow-x-scroll text-center">
                Transaction successful! Hash: {txHash}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SetPriceIdForRedemptionId;
