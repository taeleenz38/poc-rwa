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

interface SetClaimTimestampProps {
  isOpen: boolean;
  onClose: () => void;
}

const SetClaimTimestamp: React.FC<SetClaimTimestampProps> = ({
  isOpen,
  onClose,
}) => {
  const [depositId, setDepositId] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const { writeContractAsync, isPending } = useWriteContract({ config });

  const resetForm = () => {
    setDepositId("");
  };

  const onCloseModal = () => {
    onClose();
    resetForm();
  };

  const onDepositIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepositId(e.target.value);
  };

  const handleSetClaimTimestamp = async () => {
    const depositIdFormatted = Number(depositId);
    const depositIdHexlified = ethers.utils.hexZeroPad(
      ethers.utils.hexlify(depositIdFormatted),
      32
    );
    const currentTime = Math.floor(Date.now() / 1000);
    const claimTimestampFormatted = BigNumber.from(currentTime + 300);
    console.log(currentTime, claimTimestampFormatted);
    try {
      const tx = await writeContractAsync({
        abi: abi.abi,
        address: process.env.NEXT_PUBLIC_AYF_MANAGER_ADDRESS as `0x${string}`,
        functionName: "setClaimableTimestamp",
        args: [claimTimestampFormatted, [depositIdHexlified]],
      });
      setTxHash(tx);
      console.log("Price Id Successfully Set - transaction hash:", tx);
    } catch (error) {
      console.error("Error setting claimTimestamp:", error);
    }
  };

  const { data: receipt, isLoading } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="p-6 rounded-lg text-light bg-primary border-2 border-light shadow-md shadow-white w-1/4">
        <div className="flex justify-between items-center mb-8">
          <div></div>
          <h2 className="text-3xl font-bold">Set Claim Timestamp</h2>
          <CloseButton onClick={onCloseModal} />
        </div>
        <div className="text-center px-8 text-xl mb-4 font-medium">
          Please enter the Deposit ID for which you want to set a claim
          timestamp.
        </div>
        <div className="w-full text-center mx-auto mb-8">
          <InputField
            label="Deposit ID:"
            value={depositId || ""}
            onChange={onDepositIdChange}
          />
        </div>
        <div className="w-full flex justify-between">
          <div className="w-[49%]">
            <Submit
              onClick={onCloseModal}
              label={"Go Back"}
              disabled={isPending || isLoading}
              className="w-full bg-[#e6e6e6] text-primary"
            />
          </div>
          <div className="w-[49%]">
            <Submit
              onClick={handleSetClaimTimestamp}
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

export default SetClaimTimestamp;
