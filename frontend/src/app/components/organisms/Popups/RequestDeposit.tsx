"use client";
import { BigNumber } from "ethers";
import { useState, useEffect } from "react";
import InputField from "@/app/components/atoms/Inputs/TextInput";
import CloseButton from "@/app/components/atoms/Buttons/CloseButton";
import Submit from "@/app/components/atoms/Buttons/Submit";
import abi from "@/artifacts/ABBYManager.json";
import audcabi from "@/artifacts/AUDC.json";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { config } from "@/config";

interface RequestDepositProps {
  isOpen: boolean;
  onClose: () => void;
}

const RequestDeposit: React.FC<RequestDepositProps> = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState<string>("");
  const [txApprovalHash, setTxApprovalHash] = useState<string | null>(null);
  const [txDepositHash, setTxDepositHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validAmount, setValidAmount] = useState<boolean>(true);
  const { writeContractAsync, isPending } = useWriteContract({ config });
  const [showLink, setShowLink] = useState(false);

  const MIN_AMOUNT = 100000;
  const MAX_AMOUNT = 5000000;

  const resetForm = () => {
    setAmount("");
    setTxDepositHash(null);
    setTxApprovalHash(null);
    setError(null);
    setValidAmount(true);
    setShowLink(false);
  };

  const onCloseModal = () => {
    onClose();
    resetForm();
  };

  const onAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);

    const numericAmount = parseFloat(e.target.value);
    if (
      isNaN(numericAmount) ||
      numericAmount < MIN_AMOUNT ||
      numericAmount > MAX_AMOUNT
    ) {
      setError(`Amount must be between ${MIN_AMOUNT} and ${MAX_AMOUNT}.`);
      setValidAmount(false);
    } else {
      setError(null);
      setValidAmount(true);
    }
  };

  const handleRequestDeposit = async () => {
    if (!validAmount) return;

    try {
      // Convert the amount to a string to handle both integer and float values
      const amountString = amount.toString();

      // Split the string into integer and fractional parts
      const [integerPart, decimalPart = ""] = amountString.split(".");

      // Convert integer part to BigNumber
      let integerAmount = BigNumber.from(integerPart).mul(
        BigNumber.from(10).pow(18)
      );

      // Convert fractional part to BigNumber, adjusting for its length
      let fractionalAmount = BigNumber.from(0);
      if (decimalPart.length > 0) {
        fractionalAmount = BigNumber.from(decimalPart).mul(
          BigNumber.from(10).pow(18 - decimalPart.length)
        );
      }

      // Sum the integer and fractional amounts
      const approvalAmount = integerAmount.add(fractionalAmount);

      const approvalTx = await writeContractAsync({
        abi: audcabi.abi,
        address: process.env.NEXT_PUBLIC_AUDC_ADDRESS as `0x${string}`,
        functionName: "approve",
        args: [process.env.NEXT_PUBLIC_VLR_MANAGER_ADDRESS, approvalAmount],
      });

      setTxApprovalHash(approvalTx);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const { data: approvalReceipt, isLoading: isApprovalLoading } =
    useWaitForTransactionReceipt({
      hash: txApprovalHash as `0x${string}`,
    });

  useEffect(() => {
    if (approvalReceipt) {
      const requestDepositTransaction = async () => {
        try {
          // Convert the amount to a string to handle both integer and float values
          const amountString = amount.toString();

          // Split the string into integer and fractional parts
          const [integerPart, decimalPart = ""] = amountString.split(".");

          // Convert integer part to BigNumber
          let integerAmount = BigNumber.from(integerPart).mul(
            BigNumber.from(10).pow(18)
          );

          // Convert fractional part to BigNumber, adjusting for its length
          let fractionalAmount = BigNumber.from(0);
          if (decimalPart.length > 0) {
            fractionalAmount = BigNumber.from(decimalPart).mul(
              BigNumber.from(10).pow(18 - decimalPart.length)
            );
          }

          // Sum the integer and fractional amounts
          const depositAmount = integerAmount.add(fractionalAmount);

          const depositTx = await writeContractAsync({
            abi: abi.abi,
            address: process.env
              .NEXT_PUBLIC_VLR_MANAGER_ADDRESS as `0x${string}`,
            functionName: "requestSubscription",
            args: [depositAmount],
          });

          setTxDepositHash(depositTx);
        } catch (error) {
          console.error("Error requesting deposit:", error);
        }
      };

      requestDepositTransaction();
    }
  }, [amount, writeContractAsync, approvalReceipt]);

  const { data: depositReceipt, isLoading: isDepositLoading } =
    useWaitForTransactionReceipt({
      hash: txDepositHash as `0x${string}`,
    });

  useEffect(() => {
    if (txDepositHash) {
      const timer = setTimeout(() => {
        setShowLink(true);
      }, 18000);
      return () => clearTimeout(timer);
    }
  }, [txDepositHash]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="p-6 rounded-lg text-gray bg-white shadow-md shadow-white w-1/3">
        <div className="flex justify-between items-center mb-8">
          <div></div>
          <h2 className="text-2xl font-bold text-primary">Buy VLR</h2>
          <CloseButton onClick={onCloseModal} />
        </div>
        <div className="text-center px-8  mb-4 ">
          Please enter the amount of AUDC you wish to deposit in return for VLR.
        </div>
        <div className="w-full text-center mx-auto mb-4">
          <InputField
            label="Amount:"
            value={amount || ""}
            onChange={onAmountChange}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <div className="w-full flex justify-between">
          <div className="w-[49%]">
            <Submit
              onClick={onCloseModal}
              label={"Go Back"}
              disabled={isPending || isApprovalLoading}
              className="w-full !bg-[#e6e6e6] !text-primary hover:!text-secondary"
            />
          </div>
          <div className="w-[49%]">
            <Submit
              onClick={handleRequestDeposit}
              label={
                isPending || isApprovalLoading ? "Confirming..." : "Confirm"
              }
              disabled={
                isPending ||
                isApprovalLoading ||
                isDepositLoading ||
                !validAmount
              }
              className="w-full"
            />
          </div>
        </div>
        {txApprovalHash && isApprovalLoading && (
          <div className="mt-4 text-primary text-center">
            <p>Approval transaction is pending...</p>
          </div>
        )}
        {txDepositHash && (
          <div className="mt-4 text-primary text-center overflow-x-scroll">
            {!showLink && <p>Deposit transaction is pending...</p>}
            {showLink && (
              <a
                href={`https://sepolia.etherscan.io/tx/${txDepositHash}`}
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

export default RequestDeposit;
