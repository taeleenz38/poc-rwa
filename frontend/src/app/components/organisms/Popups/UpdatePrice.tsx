"use client";
import { BigNumber, ethers } from "ethers";
import { useState, useEffect } from "react";
import InputField from "@/app/components/atoms/Inputs/TextInput";
import CloseButton from "@/app/components/atoms/Buttons/CloseButton";
import Submit from "@/app/components/atoms/Buttons/Submit";
import abi from "@/artifacts/Pricer.json";
import axios from "axios";
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
  const [safeTxHash, setSafeTxHash] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { writeContractAsync, isPending } = useWriteContract({ config });
  const [showLink, setShowLink] = useState(false);

  const resetForm = () => {
    setUpdatePrice("");
    setShowLink(false);
    setTxHash("");
    setSafeTxHash("");
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

  console.log(priceId);

  const handleUpdatePrice = async () => {
    try {
      const priceID = Number(priceId);
      const priceIDHexlified = ethers.utils.hexZeroPad(
        ethers.utils.hexlify(priceID),
        32
      );

      const parsedPrice = parseFloat(updatePrice);
      const price = ethers.utils.parseUnits(parsedPrice.toString(), 18);

      console.log("priceID", priceID.toString());
      console.log("price", price.toString());

      const tx = await writeContractAsync({
        abi: abi.abi,
        address: process.env.NEXT_PUBLIC_PRICER_ADDRESS as `0x${string}`,
        functionName: "updatePrice",
        args: [priceIDHexlified, price],
      });

      setSafeTxHash(tx);
      console.log("Price successfully updated - transaction hash:", tx);
    } catch (error) {
      console.error("Error updating price:", error);
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
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [safeTxHash]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="p-8 rounded-lg text-gray bg-white shadow-md shadow-white w-1/3">
        <div className="flex justify-between items-center mb-8">
          <div></div>
          <h2 className="text-2xl font-bold text-primary">Update Price</h2>
          <CloseButton onClick={onCloseModal} />
        </div>
        <div className="text-center px-8 mb-4 ">
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
              disabled={isPending}
              className="w-full !bg-[#e6e6e6] !text-primary hover:!text-secondary"
            />
          </div>
          <div className="w-[49%]">
            <Submit
              onClick={handleUpdatePrice}
              label={isPending ? "Confirming..." : "Confirm"}
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

export default UpdatePrice;
