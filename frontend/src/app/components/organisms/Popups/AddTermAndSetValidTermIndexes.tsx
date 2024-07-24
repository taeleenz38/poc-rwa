"use client";
import { useState } from "react";
import InputField from "@/app/components/atoms/Inputs/TextInput";
import CloseButton from "@/app/components/atoms/Buttons/CloseButton";
import Submit from "@/app/components/atoms/Buttons/Submit";
import abi from "../../../../../../blockchain/artifacts/contracts/interfaces/IAllowlist.sol/IAllowlist.json";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { config } from "@/config";

interface AddTermAndSetValidTermIndexesProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTermAndSetValidTermIndexes: React.FC<
  AddTermAndSetValidTermIndexesProps
> = ({ isOpen, onClose }) => {
  const [term, setTerm] = useState<string | null>(null);
  const [validTermIndexes, setValidTermIndexes] = useState<number[]>([]);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [tx2Hash, setTx2Hash] = useState<string | null>(null);
  const {
    writeContractAsync: writeAddTermContractAsync,
    isPending: isAddTermPending,
  } = useWriteContract({ config });
  const {
    writeContractAsync: writeSetIndexesContractAsync,
    isPending: isSetIndexesPending,
  } = useWriteContract({ config });

  const resetForm = () => {
    setTerm(null);
    setValidTermIndexes([]);
    setTxHash(null);
    setTx2Hash(null);
  };

  const onCloseModal = () => {
    onClose();
    resetForm();
  };

  const onTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
  };

  const handleAddTerm = async () => {
    try {
      const tx = await writeAddTermContractAsync({
        abi: abi.abi,
        address: process.env.NEXT_PUBLIC_ALLOWLIST_ADDRESS as `0x${string}`,
        functionName: "addTerm",
        args: [term],
      });
      setTxHash(tx);
      console.log("Term successfully added - transaction hash:", tx);
    } catch (error) {
      console.error("Error adding term to allowlist:", error);
    }
  };

  const { data: receipt, isLoading } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
  });

  const onValidTermSetValidTermIndexesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    const indexes = value
      .split(",")
      .map((item) => parseInt(item.trim(), 10))
      .filter((item) => !isNaN(item));
    setValidTermIndexes(indexes);
  };

  const handleSetValidTermIndexes = async () => {
    try {
      const tx = await writeSetIndexesContractAsync({
        abi: abi.abi,
        address: process.env.NEXT_PUBLIC_ALLOWLIST_ADDRESS as `0x${string}`,
        functionName: "setValidTermIndexes",
        args: [validTermIndexes],
      });
      setTx2Hash(tx);
      console.log(
        "Successfully set valid term indexes - transaction hash:",
        tx
      );
    } catch (error) {
      console.error("Error setting valid term indexes:", error);
    }
  };

  const { data: receipt2, isLoading: isLoading2 } =
    useWaitForTransactionReceipt({
      hash: tx2Hash as `0x${string}`,
    });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="p-6 rounded-lg text-light bg-primary border-2 border-light  shadow-md shadow-white w-1/3">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">
            Add Term and Set Valid Term Indexes
          </h2>
          <CloseButton onClick={onCloseModal} />
        </div>
        <InputField label="Term:" value={term || ""} onChange={onTermChange} />
        <div className="w-full flex justify-end mb-4">
          <Submit
            onClick={handleAddTerm}
            label={isAddTermPending ? "Confirming..." : "Add Term"}
            disabled={isAddTermPending || isLoading}
          />
        </div>
        {txHash && (
          <div className="mt-4 text-white mb-4">
            {isLoading && <p>Transaction is pending...</p>}
            {receipt && (
              <p className="text-white overflow-x-scroll">
                Transaction successful! Hash: {txHash}
              </p>
            )}
          </div>
        )}
        <InputField
          label="Valid Term Indexes:"
          value={validTermIndexes.join(", ")}
          onChange={onValidTermSetValidTermIndexesChange}
        />
        <div className="w-full flex justify-end">
          <Submit
            onClick={handleSetValidTermIndexes}
            label={isSetIndexesPending ? "Confirming..." : "Set"}
            disabled={isSetIndexesPending || isLoading2}
          />
        </div>
        {tx2Hash && (
          <div className="mt-4 text-white">
            {isLoading2 && <p>Transaction is pending...</p>}
            {receipt2 && (
              <p className="text-white overflow-x-scroll">
                Transaction successful! Hash: {tx2Hash}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddTermAndSetValidTermIndexes;
