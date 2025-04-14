"use client";
import { BigNumber } from "ethers";
import { useState, useEffect } from "react";
import InputField from "@/app/components/atoms/Inputs/TextInput";
import CloseButton from "@/app/components/atoms/Buttons/CloseButton";
import Submit from "@/app/components/atoms/Buttons/Submit";
import abi from "@/artifacts/ABBYManager.json";
import hyfmabi from "@/artifacts/HYFManager.json";
import ayfabi from "@/artifacts/ABBY.json";
import hyfabi from "@/artifacts/HYF.json";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { config } from "@/config";

interface RequestRedemptionProps {
  isOpen: boolean;
  onClose: () => void;
}

const RequestRedemption: React.FC<RequestRedemptionProps> = ({
  isOpen,
  onClose,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [txApprovalHash, setTxApprovalHash] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("AUDC");
  const [txRedemptionHash, setTxRedemptionHash] = useState<string | null>(null);
  const { writeContractAsync, isPending } = useWriteContract({ config });
  const [showLink, setShowLink] = useState(false);

  const resetForm = () => {
    setAmount("");
    setTxRedemptionHash(null);
    setTxApprovalHash(null);
    setShowLink(false);
  };

  const onCloseModal = () => {
    onClose();
    resetForm();
  };

  const onAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleRequestRedemption = async () => {
    if (selectedCurrency === "AUDC") {
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
          abi: ayfabi.abi,
          address: process.env.NEXT_PUBLIC_EQV_ADDRESS as `0x${string}`,
          functionName: "approve",
          args: [
            process.env.NEXT_PUBLIC_EQV_MANAGER_ADDRESS as `0x${string}`,
            approvalAmount,
          ],
        });

        setTxApprovalHash(approvalTx);
      } catch (error) {
        console.error("Error approving:", error);
      }
    } else {
      try {
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
          abi: hyfabi.abi,
          address: process.env.NEXT_PUBLIC_EQV_ADDRESS as `0x${string}`,
          functionName: "approve",
          args: [
            process.env.NEXT_PUBLIC_HYF_MANAGER_ADDRESS as `0x${string}`,
            approvalAmount,
          ],
        });

        setTxApprovalHash(approvalTx);
      } catch (error) {
        console.error("Error approving:", error);
      }
    }
  };

  const { data: approvalReceipt, isLoading: isApprovalLoading } =
    useWaitForTransactionReceipt({
      hash: txApprovalHash as `0x${string}`,
    });

  useEffect(() => {
    if (approvalReceipt && selectedCurrency === "AUDC") {
      const requestRedemptionTransaction = async () => {
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

          // Sum the integer and fractional amounts to get the full redemption amount
          const redemptionAmount = integerAmount.add(fractionalAmount);

          const redemptionTx = await writeContractAsync({
            abi: abi.abi,
            address: process.env
              .NEXT_PUBLIC_EQV_MANAGER_ADDRESS as `0x${string}`,
            functionName: "requestRedemption",
            args: [redemptionAmount],
          });

          setTxRedemptionHash(redemptionTx);
        } catch (error) {
          console.error("Error requesting redemption:", error);
        }
      };

      requestRedemptionTransaction();

    } else if (approvalReceipt && selectedCurrency === "USDC") {
      const requestRedemptionTransaction = async () => {
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

          // Sum the integer and fractional amounts to get the full redemption amount
          const redemptionAmount = integerAmount.add(fractionalAmount);

          const redemptionTx = await writeContractAsync({
            abi: hyfmabi.abi,
            address: process.env
              .NEXT_PUBLIC_HYF_MANAGER_ADDRESS as `0x${string}`,
            functionName: "requestRedemption",
            args: [redemptionAmount],
          });

          setTxRedemptionHash(redemptionTx);
        } catch (error) {
          console.error("Error requesting redemption:", error);
        }
      };

      requestRedemptionTransaction();
    }
  }, [amount, writeContractAsync, approvalReceipt, selectedCurrency]);

  const { data: redemptionReceipt, isLoading: isRedemptionLoading } =
    useWaitForTransactionReceipt({
      hash: txRedemptionHash as `0x${string}`,
    });

  useEffect(() => {
    if (txRedemptionHash) {
      const timer = setTimeout(() => {
        setShowLink(true);
      }, 18000);
      return () => clearTimeout(timer);
    }
  }, [txRedemptionHash]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="p-6 rounded-lg text-gray bg-white shadow-md shadow-white w-1/3">
        <div className="flex justify-between items-center mb-8">
          <div></div>
          <h2 className="text-2xl font-bold text-primary">
            Redeem EQV For Stablecoins
          </h2>
          <CloseButton onClick={onCloseModal} />
        </div>
        <div className="text-center px-8 mb-4">
          Please select the stablecoin currency and the amount you wish to
          redeem EQV for.
        </div>
        <div className="w-full flex justify-between items-center text-center mx-auto mb-8">
          <InputField
            label="Amount:"
            value={amount || ""}
            onChange={onAmountChange}
          />
          <div className="ml-4">
            <select
              id="currency"
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="mt-1 mb-5 p-2 border border-primary bg-primary text-white rounded-md hover:cursor-pointer"
            >
              <option value="AUDC">AUDC</option>
              <option value="USDC">USDC</option>
            </select>
          </div>
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
              onClick={handleRequestRedemption}
              label={
                isPending || isApprovalLoading ? "Confirming..." : "Confirm"
              }
              disabled={isPending || isApprovalLoading}
              className="w-full"
            />
          </div>
        </div>
        {txApprovalHash && isApprovalLoading && (
          <div className="mt-4 text-primary text-center">
            <p>Approval transaction is pending...</p>
          </div>
        )}
        {txRedemptionHash && (
          <div className="mt-4 text-primary text-center overflow-x-scroll">
            {!showLink && <p>Redemption transaction is pending...</p>}
            {showLink && (
              <a
                href={`https://sepolia.etherscan.io/tx/${txRedemptionHash}`}
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

export default RequestRedemption;
