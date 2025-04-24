"use client";
import Button from "@/app/components/atoms/Buttons/Button";
import abi from "@/artifacts/ABBYManager.json";
import hyfabi from "@/artifacts/HYFManager.json";
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
import { Provider } from "urql";
import { eqv } from "@/lib/urql";
import { useAccount, useBalance, useWriteContract } from "wagmi";
import BigNumber from "bignumber.js";
import PendingTokensTable from "@/app/components/organisms/PendingTokensTable";
import RedemptionTable from "@/app/components/organisms/PendingRedemptionsTable";
import { useEqvData } from "@/hooks/useEqvData";
import { useVlrData } from "@/hooks/useVlrData";
import TransactionTable from "../components/organisms/TransactionsTable";
import HoldingsTable from "../components/organisms/HoldingsTable";

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
  redemptionId: string;
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
  const [vlrTokens, setVlrTokens] = useState<ClaimableToken[]>([]);
  const [eqvTokens, setEqvTokens] = useState<ClaimableToken[]>([]);
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
  const [eqvTransactions, setEqvTransactions] = useState<Transaction[]>([]);
  const { eqvNav, eqvTotalSupply, eqvPrice } = useEqvData();
  const { vlrNav, vlrTotalSupply, vlrPrice } = useVlrData();

  const { writeContractAsync } = useWriteContract({ config });

  const { data: vlrData } = useBalance({
    address,
    token: process.env.NEXT_PUBLIC_VLR_ADDRESS as `0x${string}`,
    config,
  });

  const { data: eqvData } = useBalance({
    address,
    token: process.env.NEXT_PUBLIC_EQV_ADDRESS as `0x${string}`,
    config,
  });

  const [{ data: priceListData, error: priceListError }] = useQuery({
    query: GET_PRICE_LIST,
  });

  const [
    {
      data: vlrTransactionData,
      fetching: fetchingTransactions,
      error: transactionError,
    },
  ] = useQuery({
    query: GET_TRANSACTION_HISTORY,
    variables: { user: address || "" },
  });

  useEffect(() => {
    const fetchEQVTransactions = async () => {
      try {
        const result = await eqv
          .query(GET_TRANSACTION_HISTORY, {
            user: address || "",
          })
          .toPromise();

        if (result.data) {
          const deposits = result.data.depositTransactionHistories;
          const redemptions = result.data.redemptionTransactionHistories;
          setEqvTransactions([...deposits, ...redemptions]);
        }
      } catch (error) {
        console.error("Error fetching EQV transaction history:", error);
      }
    };

    if (address) {
      fetchEQVTransactions();
    }
  }, [address]);

  // VLR query using default urql client (already in your code)
  const [{ data: vlrClaimableData }] = useQuery({
    query: GET_CLAIMABLE_DETAILS,
    variables: { user: address || "" },
  });

  // EQV query using custom urql client
  useEffect(() => {
    const fetchEQVClaimable = async () => {
      try {
        const result = await eqv
          .query(GET_CLAIMABLE_DETAILS, {
            user: address || "",
          })
          .toPromise();

        if (result.data) {
          setEqvTokens(result.data.pendingDepositRequests);
        }
      } catch (error) {
        console.error("Error fetching EQV claimable tokens", error);
      } finally {
        setIsFetching(false);
      }
    };

    if (address) {
      fetchEQVClaimable();
    }
  }, [address]);

  const [
    {
      data: claimableRedemptionListData,
      fetching: fetchingClaimableRedemptionList,
    },
  ] = useQuery({
    query: GET_CLAIMABLE_REDEMPTION_LIST,
    variables: { user: address || "" },
  });

  const allTransactions = [
    ...(vlrTransactionData?.depositTransactionHistories || []),
    ...(vlrTransactionData?.redemptionTransactionHistories || []),
    ...eqvTransactions,
  ];

  const sortedTransactions = allTransactions.sort(
    (a, b) =>
      new Date(b.transactionDate).getTime() -
      new Date(a.transactionDate).getTime()
  );

  console.log("transactions", allTransactions);

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = allTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const totalPages = Math.ceil(allTransactions.length / transactionsPerPage);

  const handlePageChange = (pageNumber: React.SetStateAction<number>) => {
    setCurrentPage(pageNumber);
  };

  const formattedPrice = price
    ? formatNumber(parseFloat(weiToEther(price)))
    : "...";

  const formatBalance = (balanceData: any): number => {
    return balanceData?.formatted ? parseFloat(balanceData.formatted) : 0.0;
  };

  const formattedVlrBalance = formatBalance(vlrData);
  const formattedEqvBalance = formatBalance(eqvData);

  useEffect(() => {
    if (vlrClaimableData) {
      setVlrTokens(vlrClaimableData.pendingDepositRequests);
      setIsFetching(false);
    }
  }, [vlrClaimableData]);

  useEffect(() => {
    if (claimableRedemptionListData) {
      const redemptionRequests = claimableRedemptionListData.redemptionRequests;

      const audcRequests = redemptionRequests.filter(
        (request: any) => request.collateralType === "AUDC"
      );

      setClaimableAUDCTokens(audcRequests);
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
        address: process.env.NEXT_PUBLIC_VLR_MANAGER_ADDRESS as `0x${string}`,
        functionName: "claimMint",
        args: [[depositIdHexlified]],
      });
      return tx;
    } catch (error) {
      console.error("Error claiming tokens:", error);
      throw error;
    }
  };

  const claimMintEQV = async (depositId: string) => {
    const depositIdFormatted = Number(depositId);
    const depositIdHexlified = ethers.utils.hexZeroPad(
      ethers.utils.hexlify(depositIdFormatted),
      32
    );
    try {
      const tx = await writeContractAsync({
        abi: abi.abi,
        address: process.env.NEXT_PUBLIC_EQV_MANAGER_ADDRESS as `0x${string}`,
        functionName: "claimMint",
        args: [[depositIdHexlified]],
      });
      return tx;
    } catch (error) {
      console.error("Error claiming tokens:", error);
      throw error;
    }
  };

  const claimRedemption = async (redemptionId: string) => {
    const redemptionIdFormatted = Number(redemptionId);
    const redemptionIdHexlified = ethers.utils.hexZeroPad(
      ethers.utils.hexlify(redemptionIdFormatted),
      32
    );
    if (openRedemptionAccordion === "AUDC") {
      try {
        const tx = await writeContractAsync({
          abi: abi.abi,
          address: process.env.NEXT_PUBLIC_VLR_MANAGER_ADDRESS as `0x${string}`,
          functionName: "claimRedemption",
          args: [[redemptionIdHexlified]],
        });
      } catch (error) {
        console.error("Error claiming tokens:", error);
      }
    } else {
      try {
        const tx = await writeContractAsync({
          abi: hyfabi.abi,
          address: process.env.NEXT_PUBLIC_EQV_MANAGER_ADDRESS as `0x${string}`,
          functionName: "claimRedemption",
          args: [[redemptionIdHexlified]],
        });
      } catch (error) {
        console.error("Error claiming tokens:", error);
      }
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
  const vlrBalanceInEther = weiToEther(formattedVlrBalance.toString());
  const vlrMarketValueInEther = parseFloat(vlrBalanceInEther) * parsedPrice;
  const eqvMarketValueInEther = formattedEqvBalance * 420;

  const toggleAccordion = (accordion: string) => {
    setOpenAccordion(openAccordion === accordion ? null : accordion);
  };

  const toggleRedemptionAccordion = (accordion: string) => {
    setOpenRedemptionAccordion(
      openRedemptionAccordion === accordion ? null : accordion
    );
  };

  const totalMarketValue =
    Number(eqvMarketValueInEther) + Number(vlrMarketValueInEther);
  const totalPortfolioValue = formatNumber(totalMarketValue);

  return (
    <>
      <div className="min-h-screen w-full flex flex-col text-secondary py-4 md:py-8 lg:py-16 px-4 lg:px-[7.7rem]">
        <h1 className="flex text-4xl font-semibold mb-4 items-center justify-start text-secondary">
          Your portfolio
        </h1>
        <h2 className="flex text-xl font-normal items-center justify-start mb-2 text-secondary">
          Track and manage your portfolio
        </h2>

        <div className="flex flex-col justify-start py-3 items-start my-4 px-4 bg-[url('/home-bg.jpg')] bg-cover bg-center bg-no-repeat rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
          <h2 className="text-3xl font-semibold flex items-center justify-start px-1 text-white ">
            Overview
          </h2>
          <div className="flex flex-col justify-start py-2 items-start my-4 mx-4">
            <div className="border-l-4 border-white px-3">
              <div className="flex flex-col gap-y-5">
                <h3 className="text-xl flex items-center justify-start text-white">
                  Current portfolio value
                </h3>
                <>
                  {isFetching ? (
                    <>
                      <Skeleton height={30} className="w-full text-white" />
                    </>
                  ) : (
                    <h3 className="text-2xl text-white">
                      ${totalPortfolioValue} AUD
                    </h3>
                  )}
                </>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl">
          <div className="flex flex-col gap-y-4 w-full">
            <HoldingsTable
              isFetching={isFetching}
              vlrPrice={vlrPrice}
              formattedVlrBalance={formattedVlrBalance}
              vlrMarketValueInEther={vlrMarketValueInEther}
              eqvPrice={eqvPrice}
              formattedEqvBalance={formattedEqvBalance}
              eqvMarketValueInEther={eqvMarketValueInEther}
            />

            <div className="flex flex-col w-full text-secondary rounded-xl p-8 border-2 border-primary border-opacity-30 mt-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
              <h2 className="flex font-bold text-2xl mb-8 justify-center items-center text-secondary">
                Pending Tokens
              </h2>

              {/* VLR Accordion */}
              <div className="mb-8">
                <button
                  className="w-full text-left p-8 bg-[url('/home-bg.jpg')] text-white bg-cover bg-center bg-opacity-50 bg-no-repeat rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] font-bold flex justify-between items-center"
                  onClick={() => toggleAccordion("VLR")}
                >
                  <span className="text-white">VLR</span>
                  <span>{openAccordion === "VLR" ? "▲" : "▼"}</span>
                </button>
                {openAccordion === "VLR" && (
                  <div className="p-4 bg-white rounded-md mt-2">
                    <PendingTokensTable
                      tokens={vlrTokens}
                      isFetching={isFetching}
                      claimMint={claimMint}
                      type="VLR"
                    />
                  </div>
                )}
              </div>

              {/* EQV Accordion */}
              <div className="mb-4">
                <button
                  className="w-full text-left p-8 bg-[url('/home-bg.jpg')] text-white bg-cover bg-center bg-opacity-50 bg-no-repeat rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] font-bold flex justify-between items-center"
                  onClick={() => toggleAccordion("EQV")}
                >
                  <span className="text-white">EQV</span>
                  <span>{openAccordion === "EQV" ? "▲" : "▼"}</span>
                </button>
                {openAccordion === "EQV" && (
                  <div className="p-4 bg-white rounded-md mt-2">
                    <Provider value={eqv}>
                      <PendingTokensTable
                        tokens={eqvTokens}
                        isFetching={isFetching}
                        claimMint={claimMintEQV}
                        type="EQV"
                      />
                    </Provider>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col w-full text-secondary rounded-xl p-8 border-2 border-primary border-opacity-30 mt-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
              <h2 className="flex font-bold text-2xl mb-8  justify-center items-center text-secondary">
                Pending Redemptions
              </h2>
              <div className="mb-4">
                <button
                  className="w-full text-left p-8 bg-[url('/home-bg.jpg')] text-white bg-cover bg-center bg-opacity-50 bg-no-repeat rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] font-bold flex justify-between items-center"
                  onClick={() => toggleRedemptionAccordion("AUDC")}
                >
                  <span className="text-white">AUDC</span>
                  <span>{openRedemptionAccordion === "AUDC" ? "▲" : "▼"}</span>
                </button>
                {openRedemptionAccordion === "AUDC" && (
                  <div className="p-4 bg-white mt-2 ">
                    <RedemptionTable
                      tokens={claimableAUDCTokens}
                      isFetching={isFetchingAUDC}
                      claimRedemption={claimRedemption}
                      type="AUDC"
                    />
                  </div>
                )}
              </div>
            </div>

            <TransactionTable
              transactions={currentTransactions}
              fetchingTransactions={fetchingTransactions}
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Portfolio;
