"use client";
import CloseButton from "@/app/components/atoms/Buttons/CloseButton";
import Submit from "@/app/components/atoms/Buttons/Submit";
import abi from "@/artifacts/ABBYManager.json";
import pricerabi from "@/artifacts/Pricer.json";
import { config } from "@/config";
import { GET_TRANSACTION_PRICING } from "@/lib/urqlQueries";
import axios from "axios";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import { useQuery } from "urql";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useEqvData } from "@/hooks/useEqvData";

interface ApproveDepositRequestEQVProps {
  isOpen: boolean;
  onClose: () => void;
  depositId?: string;
  walletAddress?: string;
}

interface PricingResponse {
  priceId: string;
  price: string;
  status: string;
  date: string;
}

const weiToEther = (wei: string | number): string => {
  return ethers.utils.formatUnits(wei, 18);
};

const hexToDecimal = (hex: string): number => {
  return parseInt(hex, 16);
};

const formatNumber = (
  number: number | string,
  decimalPlaces: number = 2
): string => {
  const num = typeof number === "string" ? parseFloat(number) : number;
  return num.toLocaleString(undefined, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
};

const ApproveDepositRequestEQV: React.FC<ApproveDepositRequestEQVProps> = ({
  isOpen,
  onClose,
  depositId = "",
  walletAddress = "",
}) => {
  const [localDepositId, setLocalDepositId] = useState<string>(depositId);
  const [prices, setPrices] = useState<PricingResponse[]>([]);
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);
  const { writeContractAsync, isPending } = useWriteContract({ config });
  const { eqvNav, eqvTotalSupply, eqvPrice } = useEqvData();

  const [{ data, fetching, error: queryError }] = useQuery({
    query: GET_TRANSACTION_PRICING,
  });

  useEffect(() => {
    setLocalDepositId(depositId);
  }, [depositId]);

  useEffect(() => {
    if (data) {
      const uniquePrices = data.latestPriceUpdateds.filter(
        (price: PricingResponse, index: number, self: PricingResponse[]) =>
          index === self.findIndex((p) => p.priceId === price.priceId)
      );

      const lastPrice = uniquePrices.slice(0, 1);
      setPrices(lastPrice);
    }

    if (queryError) {
      console.error("GraphQL query error:", queryError);
    }
  }, [data, queryError]);

  useEffect(() => {
    if (prices.length > 0) {
      setSelectedPriceId(prices[0].priceId);
      console.log(selectedPriceId);
    }
  }, [prices]);

  const resetForm = () => {
    setSelectedPriceId(null);
  };

  const onCloseModal = () => {
    onClose();
    resetForm();
  };

  const handlePriceSelection = (priceId: string) => {
    setSelectedPriceId(priceId);
  };

  const handleUpdatePrice = async () => {
    try {
      const priceID = Number(selectedPriceId);
      const priceIDHexlified = ethers.utils.hexZeroPad(
        ethers.utils.hexlify(priceID),
        32
      );

      const parsedPrice = parseFloat(eqvPrice);
      const price = ethers.utils.parseUnits(parsedPrice.toString(), 18);

      console.log("priceID", priceID.toString());
      console.log("price", price.toString());

      const tx = await writeContractAsync({
        abi: pricerabi.abi,
        address: process.env.NEXT_PUBLIC_EQV_PRICER_ADDRESS as `0x${string}`,
        functionName: "updatePrice",
        args: [priceIDHexlified, price],
      });

      console.log("Price successfully updated - transaction hash:", tx);
    } catch (error) {
      console.error("Error updating price:", error);
    }
  };

  const handleApproveDepositRequestEQV = async () => {
    if (!selectedPriceId && eqvPrice) return;

    try {
      // Call updatePrice first
      await handleUpdatePrice();

      const depositIdFormatted = Number(localDepositId);
      const depositIdHexlified = ethers.utils.hexZeroPad(
        ethers.utils.hexlify(depositIdFormatted),
        32
      );

      const formattedPriceId = BigNumber.from(selectedPriceId);
      console.log(
        "Setting priceId for depositId:",
        depositIdHexlified,
        formattedPriceId
      );

      const tx = await writeContractAsync({
        abi: abi.abi,
        address: process.env.NEXT_PUBLIC_EQV_MANAGER_ADDRESS as `0x${string}`,
        functionName: "setPriceIdForDeposits",
        args: [[depositIdHexlified], [formattedPriceId]],
      });
    } catch (error) {
      console.error("Error during approval process:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="p-6 rounded-lg text-gray bg-white shadow-md shadow-white w-1/3">
        <div className="flex justify-between items-center mb-8">
          <div></div>
          <h2 className="text-2xl font-bold text-primary">
            Set Price ID For Deposit ID
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
                <div className="font-semibold">
                  Price: {formatNumber(weiToEther(price.price))} AUDC
                </div>
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
              className="w-full !bg-[#e6e6e6] !text-secondary hover:!text-primary"
            />
          </div>
          <div className="w-[49%]">
            <Submit
              onClick={handleApproveDepositRequestEQV}
              label={isPending ? "Confirming..." : "Confirm"}
              disabled={isPending || !selectedPriceId || !eqvPrice}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
//

export default ApproveDepositRequestEQV;
