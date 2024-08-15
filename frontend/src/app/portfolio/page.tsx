"use client";
import Button from "@/app/components/atoms/Buttons/Button";
import abi from "@/artifacts/ABBYManager.json";
import { config } from "@/config";
import axios from "axios";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAccount, useBalance, useWriteContract } from "wagmi";

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

interface Item {
  date: string;
}

const formatNumber = (value: number, options?: Intl.NumberFormatOptions) => {
  return new Intl.NumberFormat("en-US", options).format(value);
};

const Portfolio = () => {
  // const router = useRouter();
  // const isLoggedIn = localStorage.getItem("isLoggedIn");
  const { address } = useAccount({
    config,
  });
  const { writeContractAsync } = useWriteContract({ config });

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
  const [price, setPrice] = useState<string | null>(null);

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

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-UK");
    const formattedTime = date.toLocaleTimeString("en-UK");
    return `${formattedDate} ${formattedTime}`;
  };

  const formattedPrice = price ? parseFloat(price) : 0;

  const formatBalance = (balanceData: any): number => {
    return balanceData?.formatted ? parseFloat(balanceData.formatted) : 0.0;
  };

  const formattedAyfBalance = formatBalance(ayfData);

  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     router.push("/");
  //   }
  // }, [isLoggedIn, router]);

  // if (!isLoggedIn) {
  //   return null;
  // }

  useEffect(() => {
    const fetchClaimableTokens = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/claimable-details/${address}`
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
  }, [address]);

  useEffect(() => {
    const fetchClaimableAUDCTokens = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/claimable-redemption-list/${address}`
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
  }, [address]);

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
    } catch (error) {
      console.error("Error claiming tokens:", error);
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!address) return;

      setIsFetchingTransactions(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/transaction-history/${address}`
        );
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions", error);
      } finally {
        setIsFetchingTransactions(false);
      }
    };
    fetchTransactions();
  }, [address]);

  useEffect(() => {
    const fetchPriceId = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/price-list`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        const latestPrice = data.sort(
          (a: Item, b: Item) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];

        setPrice(latestPrice ? latestPrice.price : "N/A");
      } catch (error) {
        console.error("Error fetching price ID:", error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchPriceId();
  }, []);

  const parsedPrice = price !== null ? parseFloat(price) : 0;
  const ayfMarketValue = formattedAyfBalance * parsedPrice;

  return (
    <>
      <div className="min-h-screen w-full flex flex-col text-primary root-container">
        <h1 className="flex text-4xl font-semibold mb-4 items-center justify-start">
          Your portfolio
        </h1>
        <h2 className="flex text-xl font-normal items-center justify-start mb-2">
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
                  {isFetching ? (
                    <>
                      <Skeleton height={30} className="w-full" />
                    </>
                  ) : (
                    <h3 className="text-2xl">
                      {formatNumber(formattedPrice * formattedAyfBalance, {
                        style: "currency",
                        currency: "AUD",
                      })}
                    </h3>
                  )}
                </>
              </div>
            </div>
          </div>
        </div>

        <div className="border borderColor">
          <div className="flex flex-col gap-y-4 w-full px-4">
            <div className="flex flex-col w-full py-8 text-primary overflow-y-scroll rounded-md h-fit p-5">
              <h2 className="flex font-bold text-xl mb-4 justify-start items-center">
                Holdings
              </h2>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead className="text-primary bg-[#F5F2F2]">
                    <tr className="border-none">
                      <th>Token</th>
                      <th>Token Price AUD</th>
                      <th>Position</th>
                      <th>Market Value - AUD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isFetching ? (
                      <tr className="border-none">
                        <td colSpan={4} className="text-center py-4">
                          <Skeleton height={26} className="w-full" />
                        </td>
                      </tr>
                    ) : (
                      <>
                        <tr className="border-b borderColor">
                          <td>Copiam Australian Yield Fund</td>
                          <td>${formattedPrice}</td>
                          <td>{formatNumber(formattedAyfBalance)}</td>
                          <td>${formatNumber(ayfMarketValue)}</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col w-full py-8 text-primary overflow-y-scroll rounded-md h-fit p-5">
              <h2 className="flex font-bold text-xl mb-4 justify-start items-center">
                Pending AYF Tokens
              </h2>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead className="text-primary bg-[#F5F2F2] border-none">
                    <tr className="border-none">
                      <th>Deposit Amount After Fee</th>
                      <th>Request Date</th>
                      <th>Claimable Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isFetching ? (
                      <tr className="border-none">
                        <td colSpan={5} className="py-4">
                          <Skeleton height={26} className="w-full" />
                        </td>
                      </tr>
                    ) : claimableTokens.length === 0 ? (
                      <tr className="border-none">
                        <td colSpan={5} className="text-center py-4">
                          No pending requests found
                        </td>
                      </tr>
                    ) : (
                      claimableTokens.map((token) => {
                        const isClaimable =
                          Date.now() / 1000 >= token.claimTimestampFromChain;
                        return (
                          <tr
                            className="border-b borderColor"
                            key={token.depositId}
                          >
                            <td>{token.depositAmountAfterFee} AUDC</td>
                            <td>{token.claimTimestamp}</td>
                            <td>
                              {(token.claimableAmount || 0).toFixed(3)} AYF
                            </td>
                            <td>
                              <Button
                                text="Claim"
                                className={`py-2 btn-sm items-center flex justify-center ${
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
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col w-full py-8 text-primary overflow-y-scroll rounded-md h-fit p-5">
              <h2 className="flex font-bold text-xl mb-4 justify-start items-center">
                AUDC Redemption
              </h2>

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
                    {isFetchingAUDC ? (
                      <tr className="border-none">
                        <td
                          colSpan={3}
                          className="text-center py-4 border-none"
                        >
                          <Skeleton height={26} className="w-full" />
                        </td>
                      </tr>
                    ) : claimableAUDCTokens.length === 0 ? (
                      <tr className="border-none">
                        <td
                          colSpan={3}
                          className="text-center py-4 border-none"
                        >
                          No claimable tokens found
                        </td>
                      </tr>
                    ) : (
                      claimableAUDCTokens.map((token) => (
                        <tr
                          className="border-b borderColor"
                          key={token.redemptionId}
                        >
                          <td className="flex-1">
                            {formatNumber(
                              token.rwaAmountIn as unknown as number
                            )}{" "}
                            AYF
                          </td>
                          <td className="flex-1">
                            {formatNumber(
                              token.redeemAmount as unknown as number
                            )}{" "}
                            AUDC
                          </td>
                          <td className="flex-1">
                            <Button
                              text="Claim"
                              className={`py-2  btn-sm items-center flex justify-center ${
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
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex flex-col w-full py-8 text-primary overflow-y-scroll rounded-md h-fit p-5">
              <h2 className="flex font-bold text-xl mb-4 justify-start items-center">
                Transactions
              </h2>

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
                    {isFetchingTransactions ? (
                      <tr className="border-none">
                        <td colSpan={9} className="text-center py-4">
                          <Skeleton height={26} className="w-full" />
                        </td>
                      </tr>
                    ) : currentTransactions.length > 0 ? (
                      currentTransactions.map((transaction, index) => (
                        <tr key={index} className="border-b borderColor">
                          <td>Copiam Australian Yield Fund</td>
                          <td>{transaction.status}</td>
                          <td>{transaction.type}</td>
                          <td>{transaction.transactionDate}</td>
                          <td>
                            {transaction.price
                              ? `$${formatNumber(
                                  transaction.price as unknown as number
                                )}`
                              : ""}
                          </td>
                          <td>
                            {transaction.tokenAmount
                              ? `${formatNumber(
                                  parseFloat(transaction.tokenAmount).toFixed(
                                    2
                                  ) as unknown as number
                                )}`
                              : ""}
                          </td>
                          <td>
                            {transaction.stableAmount
                              ? `$${formatNumber(
                                  transaction.stableAmount as unknown as number
                                )}`
                              : ""}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="border-none">
                        <td colSpan={9} className="text-center py-4">
                          No transactions found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {!isFetchingTransactions && totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <Button
                    text="Previous"
                    className={`btn-sm items-center flex justify-center ${
                      currentPage !== 1
                        ? "bg-[#e6e6e6] text-primary hover:bg-light hover:text-secondary font-semibold"
                        : "bg-[#e6e6e6] text-light cursor-not-allowed"
                    }`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                  <span>
                    {currentPage} of {totalPages}
                  </span>
                  <Button
                    text="Next"
                    className={`py-2 btn-sm items-center flex justify-center ${
                      currentPage !== totalPages
                        ? "bg-[#e6e6e6] text-primary hover:bg-light hover:text-secondary font-semibold"
                        : "bg-[#e6e6e6] text-light cursor-not-allowed"
                    }`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Portfolio;
