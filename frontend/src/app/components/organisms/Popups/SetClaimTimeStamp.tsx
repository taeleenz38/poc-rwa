"use client";
import { BigNumber, ethers } from "ethers";
import { useState, useEffect } from "react";
import CloseButton from "@/app/components/atoms/Buttons/CloseButton";
import Submit from "@/app/components/atoms/Buttons/Submit";
import abi from "@/artifacts/ABBYManager.json";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { config } from "@/config";

interface SetClaimTimestampProps {
  isOpen: boolean;
  onClose: () => void;
  depositId?: string;
}

const SetClaimTimestamp: React.FC<SetClaimTimestampProps> = ({
  isOpen,
  onClose,
  depositId = "",
}) => {
  const [localDepositId, setLocalDepositId] = useState<string>(depositId);
  const [dateStamp, setDateStamp] = useState<string>("");
  const [timeStamp, setTimeStamp] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const { writeContractAsync, isPending } = useWriteContract({ config });

  useEffect(() => {
    setLocalDepositId(depositId);
  }, [depositId]);

  const resetForm = () => {
    setLocalDepositId("");
    setDateStamp("");
    setTimeStamp("");
  };

  const onCloseModal = () => {
    onClose();
    resetForm();
  };

  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateStamp(e.target.value);
  };

  const onTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeStamp(e.target.value);
  };

  const handleSetClaimTimestamp = async () => {
    const depositIdFormatted = Number(localDepositId);
    const depositIdHexlified = ethers.utils.hexZeroPad(
      ethers.utils.hexlify(depositIdFormatted),
      32
    );

    const dateTimeString = `${dateStamp}T${timeStamp}`;
    const claimTimestampInSeconds = Math.floor(
      new Date(dateTimeString).getTime() / 1000
    );
    const claimTimestampFormatted = BigNumber.from(claimTimestampInSeconds);

    console.log(depositIdHexlified);
    console.log(dateTimeString, claimTimestampFormatted.toString());

    try {
      const tx = await writeContractAsync({
        abi: abi.abi,
        address: process.env.NEXT_PUBLIC_AYF_MANAGER_ADDRESS as `0x${string}`,
        functionName: "setClaimableTimestamp",
        args: [claimTimestampFormatted, [depositIdHexlified]],
      });
      setTxHash(tx);
      console.log("Claim Timestamp Successfully Set - transaction hash:", tx);
    } catch (error) {
      console.error("Error setting claimTimestamp:", error);
    }
  };

  const { data: receipt, isLoading } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
  });

  const hexToDecimal = (hex: string): number => {
    return parseInt(hex, 16);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="p-6 rounded-lg text-gray bg-white shadow-md shadow-white w-1/3">
        <div className="flex justify-between items-center mb-8">
          <div></div>
          <h2 className="text-2xl font-bold text-primary ">
            Set Claim Timestamp
          </h2>
          <CloseButton onClick={onCloseModal} />
        </div>
        <div className="text-center px-8 mb-4 ">
          Please select the date and time you want to set the claim timestamp
          for.
        </div>
        <div className="w-4/5 mx-auto mb-8">
          <label className="block text-lg mb-2 font-semibold">Date</label>
          <input
            type="date"
            value={dateStamp}
            onChange={onDateChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
          <label className="block text-lg mb-2 mt-4 font-semibold">Time</label>
          <input
            type="time"
            value={timeStamp}
            onChange={onTimeChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
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
              onClick={handleSetClaimTimestamp}
              label={isPending ? "Confirming..." : "Confirm"}
              disabled={isPending || isLoading || !dateStamp || !timeStamp}
              className="w-full"
            />
          </div>
        </div>
        {txHash && (
          <div className="mt-4 text-primary text-center overflow-x-scroll">
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

export default SetClaimTimestamp;
