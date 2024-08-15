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
import axios from "axios";
import { config } from "@/config";

interface AllowlistProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string;
}

const RemoveAllowListPopUp: React.FC<AllowlistProps> = ({
  isOpen,
  onClose,
  walletAddress,
}) => {
  const [safeTxHash, setSafeTxHash] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { writeContractAsync, isPending } = useWriteContract({ config });
  const [showLink, setShowLink] = useState(false);

  const resetForm = () => {
    setTxHash("");
    setSafeTxHash("");
    setShowLink(false);
  };
  const onCloseModal = () => {
    onClose();
    resetForm();
  };

  const handleAllowlistRemove = async () => {
    try {
      const tx = await writeContractAsync({
        abi: abi.abi,
        address: process.env.NEXT_PUBLIC_ALLOWLIST_ADDRESS as `0x${string}`,
        functionName: "setAccountStatus",
        args: [walletAddress as `0x${string}`, 0, false],
      });
      setSafeTxHash(tx);
      console.log(
        "wallet address successfully removed - transaction hash:",
        tx
      );
    } catch (error) {
      console.error("Error removing  allowlist:", error);
    }
  };

  useEffect(() => {
    if (!safeTxHash) return;

    const fetchTransactionData = async () => {
      try {
        const transactionResponse = await axios.get(
          `https://safe-transaction-sepolia.safe.global/api/v1/multisig-transactions/${safeTxHash}/`
        );

        console.log("Transaction response:", transactionResponse.data);

        if (transactionResponse.data.transactionHash) {
          setTxHash(transactionResponse.data.transactionHash);
          setError("");
        } else {
          // If transactionHash is null, continue polling
          setTimeout(fetchTransactionData, 5000); // Retry after 5 seconds
        }
      } catch (error) {
        console.error("Error fetching transaction data:", error);
        setError("Error fetching transaction data");
      }
    };

    fetchTransactionData();
  }, [safeTxHash]);

  const { data: receipt, isLoading } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
  });

  useEffect(() => {
    if (safeTxHash) {
      const timer = setTimeout(() => {
        setShowLink(true);
      }, 24000);
      return () => clearTimeout(timer);
    }
  }, [safeTxHash]);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="p-6 rounded-lg text-gray bg-white shadow-md shadow-white w-1/3">
        <div className="flex justify-between items-center mb-8">
          <div></div>
          <h2 className="text-2xl font-bold text-primary ">
            Remove User From Allowlist
          </h2>
          <CloseButton onClick={onCloseModal} />
        </div>
        <div className="text-center px-8 mb-4 ">
          Please confirm to remove user from allow list
        </div>
        <div className="w-full mx-auto mb-8">
          <InputField
            label="Wallet Address:"
            value={walletAddress}
            onChange={() => {}}
          />
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
              onClick={handleAllowlistRemove}
              label={isPending ? "Confirming..." : "Remove User"}
              disabled={isPending}
              className="w-full"
            />
          </div>
        </div>
        {txHash && (
          <div className="mt-4 text-primary text-center overflow-x-scroll">
            {!showLink && <p>Transaction is pending...</p>}
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

export default RemoveAllowListPopUp;
