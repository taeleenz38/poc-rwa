"use client";
import Button from "@/app/components/atoms/Buttons/Button";
import abi from "@/artifacts/ABBYManager.json";
import { config } from "@/config";
import {
  GET_PRICE_LIST,
  GET_TRANSACTION_HISTORY,
  GET_CLAIMABLE_DETAILS,
  GET_CLAIMABLE_REDEMPTION_LIST,
} from "@/lib/urqlQueries"; // Import the new query
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useQuery } from "urql";
import { useAccount, useBalance, useWriteContract } from "wagmi";
import BigNumber from "bignumber.js";
import PendingTokensTable from "@/app/components/organisms/PendingTokensTable";
import RedemptionTable from "@/app/components/organisms/PendingRedemptionsTable";

type ClaimableToken = {
  user: string;
  id: string;
  collateralAmountDeposited: string;
  depositAmountAfterFee: string;
  feeAmount: string;
  claimableTimestamp: string;
  claimTimestampFromChain: number;
  priceId: string;
  claimableAmount?: number;
};

type ClaimableAUDCToken = {
  user: string;
  id: string;
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

// Convert wei to ether
const weiToEther = (wei: string | number): string => {
  const weiBN = new BigNumber(wei);
  const etherBN = weiBN.dividedBy(new BigNumber(10).pow(18));
  return etherBN.toFixed();
};

// Format number with commas and fixed decimals
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

const Portfolio = () => {
  const { address } = useAccount({
    config,
  });
  const [claimableTokens, setClaimableTokens] = useState<ClaimableToken[]>([]);
  const [claimableAUDCTokens, setClaimableAUDCTokens] = useState<
    ClaimableAUDCToken[]
  >([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isFetchingAUDC, setIsFetchingAUDC] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(5);
  const [price, setPrice] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [openRedemptionAccordion, setOpenRedemptionAccordion] = useState<
    string | null
  >(null);

  const { writeContractAsync } = useWriteContract({ config });

  const { data: ayfData } = useBalance({
    address,
    token: process.env.NEXT_PUBLIC_AYF_ADDRESS as `0x${string}`,
    config,
  });

  const [{ data: priceListData, error: priceListError }] = useQuery({
    query: GET_PRICE_LIST,
  });

  const [
    {
      data: transactionData,
      fetching: fetchingTransactions,
      error: transactionError,
    },
  ] = useQuery({
    query: GET_TRANSACTION_HISTORY,
    variables: { user: address || "" },
  });

  const [{ data: claimableDetailsData, fetching: fetchingClaimableDetails }] =
    useQuery({
      query: GET_CLAIMABLE_DETAILS,
      variables: { user: address || "" },
    });

  const [
    {
      data: claimableRedemptionListData,
      fetching: fetchingClaimableRedemptionList,
    },
  ] = useQuery({
    query: GET_CLAIMABLE_REDEMPTION_LIST,
    variables: { user: address || "" },
  });

  const transactions = transactionData
    ? [
        ...transactionData.depositTransactionHistories,
        ...transactionData.redemptionTransactionHistories,
      ]
    : [];

  console.log("transactions", transactions);

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

  const formattedPrice = price
    ? formatNumber(parseFloat(weiToEther(price)))
    : "...";

  const formatBalance = (balanceData: any): number => {
    return balanceData?.formatted ? parseFloat(balanceData.formatted) : 0.0;
  };

  const formattedAyfBalance = formatBalance(ayfData);

  useEffect(() => {
    if (claimableDetailsData) {
      setClaimableTokens(claimableDetailsData.pendingDepositRequests);
      setIsFetching(false);
    }
  }, [claimableDetailsData]);

  useEffect(() => {
    if (claimableRedemptionListData) {
      setClaimableAUDCTokens(claimableRedemptionListData.redemptionRequests);
      setIsFetchingAUDC(false);
    }
  }, [claimableRedemptionListData]);

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
    if (priceListData) {
      const sortedPriceList = priceListData.priceAddeds.sort(
        (a: Item, b: Item) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const latestPrice = sortedPriceList[0];
      setPrice(latestPrice ? latestPrice.price : "...");
    }
  }, [priceListData]);

  const parsedPrice = price !== null ? parseFloat(price) : 0;
  const ayfBalanceInEther = weiToEther(formattedAyfBalance.toString());
  const ayfMarketValueInEther = parseFloat(ayfBalanceInEther) * parsedPrice;

  const toggleAccordion = (accordion: string) => {
    setOpenAccordion(openAccordion === accordion ? null : accordion);
  };

  const toggleRedemptionAccordion = (accordion: string) => {
    setOpenRedemptionAccordion(
      openRedemptionAccordion === accordion ? null : accordion
    );
  };

  return (
    <>
      <div className="min-h-screen w-full flex flex-col text-primary py-4 md:py-8 lg:py-16 px-4 lg:px-[7.7rem]">
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
                      ${formatNumber(ayfMarketValueInEther)} AUD
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
                          <td>${formatNumber(ayfMarketValueInEther)}</td>
                        </tr>
                        <tr className="border-b borderColor">
                          <td>Copiam High Yield Fund</td>
                          <td>${formattedPrice}</td>
                          <td>{formatNumber(formattedAyfBalance)}</td>
                          <td>${formatNumber(ayfMarketValueInEther)}</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col w-full py-8 text-primary rounded-md p-5">
              <h2 className="flex font-bold text-xl mb-4 justify-start items-center">
                Pending Tokens
              </h2>

              {/* AYF Accordion */}
              <div className="mb-4">
                <button
                  className="w-full text-left py-4 px-6 bg-[#F5F2F2] font-bold flex justify-between items-center"
                  onClick={() => toggleAccordion("AYF")}
                >
                  <span>AYF</span>
                  <span>{openAccordion === "AYF" ? "▲" : "▼"}</span>
                </button>
                {openAccordion === "AYF" && (
                  <div className="p-4 bg-white rounded-md mt-2">
                    <PendingTokensTable
                      tokens={claimableTokens}
                      isFetching={isFetching}
                      claimMint={claimMint}
                      type="AYF"
                    />
                  </div>
                )}
              </div>

              {/* HYF Accordion */}
              <div>
                <button
                  className="w-full text-left py-4 px-6 bg-[#F5F2F2] font-bold flex justify-between items-center"
                  onClick={() => toggleAccordion("HYF")}
                >
                  <span>HYF</span>
                  <span>{openAccordion === "HYF" ? "▲" : "▼"}</span>
                </button>
                {openAccordion === "HYF" && (
                  <div className="p-4 bg-white rounded-md mt-2">
                    {/* Currently using the same data as AYF */}
                    <PendingTokensTable
                      tokens={claimableTokens}
                      isFetching={isFetching}
                      claimMint={claimMint}
                      type="HYF"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col w-full py-8 text-primary rounded-md p-5">
              <h2 className="flex font-bold text-xl mb-4 justify-start items-center">
                AUDC Redemption
              </h2>

              {/* AYF Redemption Accordion */}
              <div className="mb-4">
                <button
                  className="w-full text-left py-4 px-6 bg-[#F5F2F2] font-bold flex justify-between items-center"
                  onClick={() => toggleRedemptionAccordion("AYF")}
                >
                  <span>AYF</span>
                  <span>{openRedemptionAccordion === "AYF" ? "▲" : "▼"}</span>
                </button>
                {openRedemptionAccordion === "AYF" && (
                  <div className="p-4 bg-white mt-2">
                    <RedemptionTable
                      tokens={claimableAUDCTokens}
                      isFetching={isFetchingAUDC}
                      claimRedemption={claimRedemption}
                      type="AYF"
                    />
                  </div>
                )}
              </div>

              {/* HYF Redemption Accordion */}
              <div>
                <button
                  className="w-full text-left py-4 px-6 bg-[#F5F2F2] font-bold flex justify-between items-center"
                  onClick={() => toggleRedemptionAccordion("HYF")}
                >
                  <span>HYF</span>
                  <span>{openRedemptionAccordion === "HYF" ? "▲" : "▼"}</span>
                </button>
                {openRedemptionAccordion === "HYF" && (
                  <div className="p-4 bg-white mt-2">
                    {/* Currently using the same data as AYF */}
                    <RedemptionTable
                      tokens={claimableAUDCTokens}
                      isFetching={isFetchingAUDC}
                      claimRedemption={claimRedemption}
                      type="HYF"
                    />
                  </div>
                )}
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
                    {fetchingTransactions ? (
                      <tr className="border-none">
                        <td colSpan={7} className="text-center py-4">
                          <Skeleton height={26} className="w-full" />
                        </td>
                      </tr>
                    ) : currentTransactions.length > 0 ? (
                      currentTransactions
                        .slice()
                        .sort(
                          (a, b) =>
                            new Date(b.transactionDate).getTime() -
                            new Date(a.transactionDate).getTime()
                        )
                        .map((transaction, index) => (
                          <tr key={index} className="border-b borderColor">
                            <td>Copiam Australian Yield Fund</td>
                            <td>{transaction.status}</td>
                            <td>{transaction.type}</td>
                            <td>{transaction.transactionDate}</td>
                            <td>
                              {transaction.price
                                ? `$${formatNumber(
                                    parseFloat(weiToEther(transaction.price))
                                  )}`
                                : ""}
                            </td>
                            <td>
                              {transaction.tokenAmount
                                ? `${formatNumber(
                                    parseFloat(
                                      weiToEther(transaction.tokenAmount)
                                    )
                                  )}`
                                : ""}
                            </td>
                            <td>
                              {transaction.stableAmount
                                ? `$${formatNumber(
                                    parseFloat(
                                      weiToEther(transaction.stableAmount)
                                    )
                                  )}`
                                : ""}
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr className="border-none">
                        <td colSpan={7} className="text-center py-4">
                          No transactions found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {!fetchingTransactions && totalPages > 1 && (
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
