"use client";
import CloseButton from "@/app/components/atoms/Buttons/CloseButton";
import Submit from "@/app/components/atoms/Buttons/Submit";
import abi from "@/artifacts/ABBYManager.json";
import { config } from "@/config";
import axios from "axios";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

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
  const [prices, setPrices] = useState<PricingResponse[]>([]);
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);
  const [safeTxHash, setSafeTxHash] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { writeContractAsync, isPending } = useWriteContract({ config });
  const [showLink, setShowLink] = useState(false);


  useEffect(() => {
    setLocalRedemptionId(redemptionId);
  }, [redemptionId]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/transaction-pricing`
        );

        // const sortedPrices = response.data.sort((a: any, b: any) => {
        //   return new Date(b.date).getTime() - new Date(a.date).getTime();
        // });

        const uniquePrices = response.data.filter(
          (price: any, index: any, self: any) =>
            index === self.findIndex((p: any) => p.priceId === price.priceId)
        );

        const lastFourPrices = uniquePrices.slice(0, 4);
        setPrices(lastFourPrices);
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };

    fetchPrices();
  }, []);

  const resetForm = () => {
    setSelectedPriceId(null);
    setShowLink(false);
    setTxHash("");
    setSafeTxHash("");
  };

  const onCloseModal = () => {
    onClose();
    resetForm();
  };

  const handlePriceSelection = (priceId: string) => {
    setSelectedPriceId(priceId);
  };

  const handleSetPriceIdForRedemptionId = async () => {
    if (!selectedPriceId) return;

    const redemptionIdFormatted = Number(localRedemptionId);
    const redemptionIdHexlified = ethers.utils.hexZeroPad(
      ethers.utils.hexlify(redemptionIdFormatted),
      32
    );

    const formattedPriceId = BigNumber.from(selectedPriceId);
    console.log(
      "Setting priceId for redemptionId:",
      redemptionIdHexlified,
      formattedPriceId
    );
    try {
      const tx = await writeContractAsync({
        abi: abi.abi,
        address: process.env.NEXT_PUBLIC_AYF_MANAGER_ADDRESS as `0x${string}`,
        functionName: "setPriceIdForRedemptions",
        args: [[redemptionIdHexlified], [formattedPriceId]],
      });
      setSafeTxHash(tx);
      console.log("Price Id Successfully Set - transaction hash:", tx);
    } catch (error) {
      console.error("Error setting priceId:", error);
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

  const hexToDecimal = (hex: string): number => {
    return parseInt(hex, 16);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="p-6 rounded-lg text-gray bg-white shadow-md shadow-white w-1/3">
        <div className="flex justify-between items-center mb-8">
          <div></div>
          <h2 className="text-2xl font-bold text-primary">
            Set Price ID For Redemption ID
          </h2>
          <CloseButton onClick={onCloseModal} />
        </div>
        {/* <div className="text-center px-8 text-xl mb-4 font-medium">
          Please select a Price ID.
        </div> */}
        <div className="w-full mx-auto mb-8 mt-8">
          {prices.map((price) => (
            <div
              key={price.priceId}
              className="flex w-4/5 mx-auto justify-between items-center mb-4 border-2 p-3 rounded-md"
            >
              <div>
                <label className="font-semibold">ID: {price.priceId}</label>
                <div className="font-semibold">Price: {price.price} AUDC</div>
              </div>
              <input
                type="radio"
                name="priceId"
                value={price.priceId}
                checked={selectedPriceId === price.priceId}
                onChange={() => handlePriceSelection(price.priceId)}
                className="custom-checkbox"
              />
            </div>
          ))}
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
              onClick={handleSetPriceIdForRedemptionId}
              label={isPending ? "Confirming..." : "Confirm"}
              disabled={isPending || !selectedPriceId}
              className="w-full"
            />
          </div>
        </div>
        {safeTxHash && (
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

export default SetPriceIdForRedemptionId;
