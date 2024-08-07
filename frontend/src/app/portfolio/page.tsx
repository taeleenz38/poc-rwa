"use client";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount, useBalance } from "wagmi";
import { config } from "@/config";
import Button from "@/app/components/atoms/Buttons/Button";
import abi from "@/artifacts/ABBYManager.json";
import { useWriteContract } from "wagmi";
import axios from "axios";

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

type ClaimableAUDCToken = {
  user: string;
  redemptionId: string;
  rwaAmountIn: string;
  priceId: string;
  redeemAmount: number;
};

type Transaction = {
  from: string;
  to: string;
  currency: string;
  price: string;
  stableAmount: string;
  tokenAmount: string;
  type: string;
  status: string;
  transactionDate: string;
};

const Portfolio = () => {
  const { address } = useAccount({
    config,
  });
  const { writeContractAsync } = useWriteContract({ config });

  const { data: audcData } = useBalance({
    address,
    token: process.env.NEXT_PUBLIC_AUDC_ADDRESS as `0x${string}`,
    config,
  });

  const { data: ayfData } = useBalance({
    address,
    token: process.env.NEXT_PUBLIC_AYF_ADDRESS as `0x${string}`,
    config,
  });

  const [claimableTokens, setClaimableTokens] = useState<ClaimableToken[]>([]);
  const [claimableAUDCTokens, setClaimableAUDCTokens] = useState<
    ClaimableAUDCToken[]
  >([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isFetchingAUDC, setIsFetchingAUDC] = useState(true);
  const [isFetchingTransactions, setIsFetchingTransactions] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(5);

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  const handlePageChange = (pageNumber: React.SetStateAction<number>) => {
    setCurrentPage(pageNumber);
  };

  const formatBalance = (balanceData: any): number => {
    return balanceData?.formatted ? parseFloat(balanceData.formatted) : 0.0;
  };

  const formattedAudcBalance = formatBalance(audcData);
  const formattedAyfBalance = formatBalance(ayfData);

  const ayfPrice = 1.04;
  const audcPrice = 1.0;

  const ayfMarketValue = formattedAyfBalance * ayfPrice;
  const audcMarketValue = formattedAudcBalance * audcPrice;
  useEffect(() => {
    const fetchClaimableTokens = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/claimable-details`
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

  useEffect(() => {
    const fetchClaimableAUDCTokens = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/claimable-redemption-list`
        );
        const data = await response.json();
        setClaimableAUDCTokens(data);
      } catch (error) {
        console.error("Error fetching claimable AUDC tokens:", error);
      } finally {
        setIsFetchingAUDC(false);
      }
    };

    fetchClaimableAUDCTokens();
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

  const claimRedemption = async (redemptionId: string) => {
    const redemptionIdFormatted = Number(redemptionId);
    const redemptionIdHexlified = ethers.utils.hexZeroPad(
      ethers.utils.hexlify(redemptionIdFormatted),
      32
    );
    try {
      const tx = await writeContractAsync({
        abi: abi.abi,
        address: process.env.NEXT_PUBLIC_AYF_MANAGER_ADDRESS as `0x${string}`,
        functionName: "claimRedemption",
        args: [[redemptionIdHexlified]],
      });
      console.log("Claim Redemption Successful! - transaction hash:", tx);
    } catch (error) {
      console.error("Error claiming tokens:", error);
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!address) return;

      setIsFetchingTransactions(true);
      try {
        const response = await axios.get(`api/transactionHistory`, {
          params: { address },
        });
        console.log("transaction history:", response.data);
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions", error);
      } finally {
        setIsFetchingTransactions(false);
      }
    };
    fetchTransactions();
  }, [address]);

  return (
    <>
      <div className="min-h-screen w-full flex flex-col text-primary root-container">
        <h1 className="flex text-4xl font-semibold mb-4 items-center justify-start">
          Your portfolio
        </h1>
        <h2 className="flex text-2xl font-normal items-center justify-start mb-4">
          Track and manage your portfolio
        </h2>

        <div className="flex flex-col justify-start py-3 items-start my-4 px-4 bg-[#F5F2F2]">
          <h2 className="text-3xl font-semibold flex items-center justify-start px-1">
            Overview
          </h2>
          <div className="flex flex-col justify-start py-2 items-start my-4 mx-4">
            <div className="border-l-4 border-[#C99383] px-3">
              <div className="flex flex-col gap-y-5">
                <h3 className="text-xl flex items-center justify-start">
                  Current portfolio value
                </h3>
                <>
                  <h3 className="text-2xl">
                    ${(ayfMarketValue + audcMarketValue).toFixed(2)}
                  </h3>
                </>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-gray">
          <div className="flex flex-col gap-y-4 w-full">
            <div className="flex flex-col w-full py-8 text-primary overflow-y-scroll rounded-md h-fit p-5">
              <h2 className="flex font-bold text-xl mb-4 justify-start items-center">
                Holdings
              </h2>
              <div className="overflow-x-auto">
                {isFetching ? (
                  <p>Loading holdings...</p>
                ) : (
                  <table className="table w-full">
                    <thead className="text-primary bg-[#F5F2F2]">
                      <tr className="border-none">
                        <th>Token</th>
                        <th>Price AUD</th>
                        <th>Amount</th>
                        <th>Market Value - AUD</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray">
                        <td>Copiam Money Market Fund AYF</td>
                        <td>$1.04</td>
                        <td>{formattedAyfBalance}</td>
                        <td>${ayfMarketValue.toFixed(2)}</td>
                      </tr>
                      <tr className="border-b border-gray">
                        <td>Stablecoin AUDC</td>
                        <td>$1.00</td>
                        <td>{formattedAudcBalance}</td>
                        <td>${audcMarketValue.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
            </div>
            <div className="flex flex-col w-full py-8 text-primary overflow-y-scroll rounded-md h-fit p-5">
              <h2 className="flex font-bold text-xl mb-4 justify-start items-center">
                Transactions
              </h2>
              {isFetchingTransactions ? (
                <p>Loading transactions...</p>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead className="text-primary bg-[#F5F2F2] border-none">
                        <tr className="border-none">
                          <th>Token</th>
                          <th>Status</th>
                          <th>Type</th>
                          <th>Date</th>
                          <th>Token Price AUD</th>
                          <th>Token Amount</th>
                          <th>Value AUD</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentTransactions.map((transaction, index) => (
                          <tr className="border-b border-gray" key={index}>
                            <td>Copiam Money Market Fund AYF</td>
                            <td>{transaction.status}</td>
                            <td>{transaction.type}</td>
                            <td>{transaction.transactionDate}</td>
                            <td>{transaction.price}</td>
                            <td>{transaction.tokenAmount}</td>
                            <td>{transaction.stableAmount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-between mt-4">
                    <button
                      className={`btn ${
                        currentPage === 1
                          ? "btn-disabled text-white"
                          : "text-primary"
                      }`}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <button
                      className={`btn ${
                        currentPage === totalPages
                          ? "btn-disabled"
                          : "text-primary"
                      }`}
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col mt-8 gap-4">
            <div className="flex flex-col gap-y-4 w-full">
              <div className="flex flex-col w-full py-8 text-primary overflow-y-scroll rounded-md h-fit p-5">
                <h2 className="flex font-bold text-xl mb-4 justify-start items-center">
                  Pending AYF Tokens
                </h2>
                {isFetching ? (
                  <p>Loading claimable tokens...</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead className="text-primary bg-[#F5F2F2] border-none">
                        <tr className="border-none">
                          <th>Deposit Amount After Fee</th>
                          <th>Fee Amount</th>
                          <th>Request Date</th>
                          <th>Claimable Amount</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {claimableTokens.map((token) => {
                          const isClaimable =
                            Date.now() / 1000 >= token.claimTimestampFromChain;
                          return (
                            <tr
                              className="border-b border-gray"
                              key={token.depositId}
                            >
                              <td>{token.depositAmountAfterFee} AUDC</td>
                              <td>{token.feeAmount} AUDC</td>
                              <td>{token.claimTimestamp}</td>
                              <td>{token.claimableAmount || 0} AYF</td>
                              <td>
                                <Button
                                  text="Claim"
                                  className={`py-2 ${
                                    isClaimable
                                      ? "bg-[#e6e6e6] text-primary hover:bg-light hover:text-secondary font-semibold"
                                      : "bg-[#e6e6e6] text-light cursor-not-allowed"
                                  }`}
                                  onClick={() => claimMint(token.depositId)}
                                  disabled={!isClaimable}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="flex flex-col w-full py-8 text-primary overflow-y-scroll rounded-md h-fit p-5">
                <h2 className="flex font-bold text-xl mb-4 justify-start items-center">
                  Claimable AUDC Tokens
                </h2>
                {isFetchingAUDC ? (
                  <p>Loading claimable AUDC tokens...</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead className="text-primary bg-[#F5F2F2] border-none">
                        <tr className="border-none">
                          <th className="flex-1">Redeem Amount</th>
                          <th className="flex-1">Claimable Amount</th>
                          <th className="flex-1">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {claimableAUDCTokens.map((token) => (
                          <tr
                            className="border-b border-gray"
                            key={token.redemptionId}
                          >
                            <td className="flex-1">{token.rwaAmountIn} AYF</td>
                            <td className="flex-1">
                              {token.redeemAmount} AUDC
                            </td>
                            <td className="flex-1">
                              <Button
                                text="Claim"
                                className={`py-2 ${
                                  true
                                    ? "bg-[#e6e6e6] text-primary hover:bg-light hover:text-secondary font-semibold"
                                    : "bg-[#e6e6e6] text-light cursor-not-allowed"
                                }`}
                                onClick={() =>
                                  claimRedemption(token.redemptionId)
                                }
                                disabled={false}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Portfolio;
