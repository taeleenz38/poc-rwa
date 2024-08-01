"use client";
import React, { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { useAccount, useBalance } from "wagmi";
import { config } from "@/config";
import Balance from "@/app/components/molecules/Balance";
import Contact from "@/app/components/molecules/Contact";
import Button from "@/app/components/atoms/Buttons/Button";
import abi from "@/artifacts/ABBYManager.json";
import { useWriteContract } from "wagmi";

type ClaimableToken = {
  user: string;
  depositId: string;
  collateralAmountDeposited: string;
  depositAmountAfterFee: string;
  feeAmount: string;
  claimTimestamp: string;
  claimTimestampFromChain: number;
  priceId: string;
  claimableAmount?: number;
};

const Portfolio = () => {
  const { address } = useAccount({
    config,
  });
  const { writeContractAsync } = useWriteContract({ config });

  const { data: audcData, isLoading: audcLoading } = useBalance({
    address,
    token: process.env.NEXT_PUBLIC_AUDC_ADDRESS as `0x${string}`,
    config,
  });

  const { data: ayfData, isLoading: ayfLoading } = useBalance({
    address,
    token: process.env.NEXT_PUBLIC_AYF_ADDRESS as `0x${string}`,
    config,
  });

  const [claimableTokens, setClaimableTokens] = useState<ClaimableToken[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchClaimableTokens = async () => {
      try {
        const response = await fetch(
          "https://api.tokenisation.gcp-hub.com.au/claimable-details"
        );
        const data = await response.json();
        setClaimableTokens(data);
      } catch (error) {
        console.error("Error fetching claimable tokens:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchClaimableTokens();
  }, []);

  const claimMint = async (depositId: string) => {
    const depositIdFormatted = Number(depositId);
    const depositIdHexlified = ethers.utils.hexZeroPad(
      ethers.utils.hexlify(depositIdFormatted),
      32
    );
    try {
      const tx = await writeContractAsync({
        abi: abi.abi,
        address: process.env.NEXT_PUBLIC_AYF_MANAGER_ADDRESS as `0x${string}`,
        functionName: "claimMint",
        args: [[depositIdHexlified]],
      });
      console.log("Claim Mint Successful! - transaction hash:", tx);
    } catch (error) {
      console.error("Error claiming tokens:", error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white flex flex-col pt-24 text-primary">
        <h1 className="px-96 text-4xl font-semibold mb-4">Your Portfolio</h1>
        <h3 className="px-96 mb-12">Take and manage your portfolio</h3>
        <Balance
          tokenSymbol="AUDC"
          balanceData={audcData}
          isLoading={audcLoading}
        />
        <Balance
          tokenSymbol="AYF"
          balanceData={ayfData}
          isLoading={ayfLoading}
        />
        <div className="flex justify-between px-96 mt-8">
          <div className="flex flex-col w-[46%] py-8 text-primary h-[70vh] overflow-y-scroll">
            <h2 className="font-semibold text-2xl mb-4">Pending AYF Tokens</h2>
            {isFetching ? (
              <p>Loading claimable tokens...</p>
            ) : (
              <div className="flex flex-col gap-y-4">
                {claimableTokens.map((token) => (
                  <div
                    key={token.depositId}
                    className="p-4 rounded-lg shadow-md"
                  >
                    <p className="mb-2">
                      <strong>Deposit Amount After Fee:</strong>{" "}
                      {token.depositAmountAfterFee} AUDC
                    </p>
                    <p className="mb-2">
                      <strong>Fee Amount:</strong> {token.feeAmount} AUDC
                    </p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="mb-2">
                          <strong>Claim Timestamp (UTC):</strong>{" "}
                          {token.claimTimestamp}
                        </p>
                        <p className="mb-2">
                          <strong>Claimable Amount:</strong>{" "}
                          {token.claimableAmount || 0} AYF
                        </p>
                      </div>
                      <Button
                        text="Claim"
                        className="bg-primary py-2 text-light hover:bg-light hover:text-primary"
                        onClick={() => claimMint(token.depositId)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-y-4 py-8 w-[46%]">
            <h2 className="font-semibold text-2xl mb-4">Holdings</h2>
            <h2 className="font-semibold text-2xl mb-4">Transactions</h2>
            <h2 className="font-semibold text-2xl mb-4">Allocation</h2>
          </div>
        </div>
      </div>
      <Contact />
    </>
  );
};

export default Portfolio;
