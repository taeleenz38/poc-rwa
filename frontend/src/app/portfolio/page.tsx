"use client";
import React, { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { useAccount, useBalance } from "wagmi";
import { config } from "@/config";
import Balance from "@/app/components/molecules/Balance";
import Balance2 from "@/app/components/molecules/Balance2";
import Contact from "@/app/components/molecules/Contact";
import Button from "@/app/components/atoms/Buttons/Button";
import abi from "@/artifacts/ABBYManager.json";
import { useWriteContract } from "wagmi";
import Accordion from "../components/organisms/accordion";

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
  const [claimableAUDCTokens, setClaimableAUDCTokens] = useState<
    ClaimableAUDCToken[]
  >([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isFetchingAUDC, setIsFetchingAUDC] = useState(true);

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

  return (
    <>
      <div className="min-h-screen bg-white flex flex-col pt-12 text-primary">
        <h1 className="flex px-[20vw] text-4xl font-semibold mb-4 items-center justify-center">
          Explore and Manage Your Investment Portfolio
        </h1>
        <h3 className="flex items-center justify-center px-80 ">
          Take control of your portfolio by easily curating and managing your
          investments.
        </h3>
        <h3 className="px-80 flex items-center justify-center mb-12">
          Keep track of your assets, make informed decisions, and optimize your
          portfolio&apos;s performance.
        </h3>

        <div className="flex mx-80 py-2 items-center justify-center bg-multi-color-gradient gap-20 ">
          <div className="flex justify-between">
            <Balance
              tokenSymbol="AUDC"
              balanceData={audcData}
              isLoading={audcLoading}
            />
          </div>
          <div className="flex justify-between">
            <Balance
              tokenSymbol="AYF"
              balanceData={ayfData}
              isLoading={ayfLoading}
            />
          </div>
        </div>

        <div className="flex justify-between px-52 mt-8 gap-10">
          <div
            className="flex flex-col gap-y-4 py-8 w-1/2 h-fit p-5 rounded-md"
            style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.25)" }}
          >
            <Accordion
              data={[
                {
                  title: "Holdings",
                  content: (
                    <>
                      <Balance2
                        tokenSymbol="AUDC"
                        balanceData={audcData}
                        isLoading={audcLoading}
                      />
                      <Balance2
                        tokenSymbol="AYF"
                        balanceData={ayfData}
                        isLoading={ayfLoading}
                      />
                    </>
                  ),
                },
                {
                  title: "Transactions",
                  content: (
                    <div className="flex flex-col text-xl">
                      <div className="flex justify-between p-2">
                        <div>Deposit - Buy AYF</div>
                        <div>
                          5,940 <span className="font-semibold">AUDC</span>
                        </div>
                      </div>
                      <div className="flex justify-between p-2">
                        <div>Deposit - Buy AYF</div>
                        <div>
                          1,000 <span className="font-semibold">AUDC</span>
                        </div>
                      </div>
                      <div className="flex justify-between p-2">
                        <div>Deposit - Buy AYF</div>
                        <div>
                          6,000 <span className="font-semibold">AUDC</span>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  title: "Allocation",
                  content: <h2 className="font-semibold text-xl mb-4">N/A</h2>,
                },
              ]}
            />
          </div>
          <div className="flex flex-col gap-y-4 w-1/2">
            <div
              className="flex flex-col w-full py-8 text-primary overflow-y-scroll rounded-md h-fit p-5"
              style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.25)" }}
            >
              <h2 className="flex font-bold text-xl mb-4 justify-center items-center ">
                Pending AYF Tokens
              </h2>
              {isFetching ? (
                <p>Loading claimable tokens...</p>
              ) : (
                <div className="flex flex-col gap-y-4">
                  {claimableTokens.map((token) => {
                    const isClaimable =
                      Date.now() / 1000 >= token.claimTimestampFromChain;
                    return (
                      <div
                        key={token.depositId}
                        className="p-4 rounded-lg shadow-md bg-primary text-light"
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
                            className={`py-2 ${
                              isClaimable
                                ? "bg-[#e6e6e6] text-primary hover:bg-light hover:text-secondary font-semibold"
                                : "bg-[#e6e6e6] text-light cursor-not-allowed"
                            }`}
                            onClick={() => claimMint(token.depositId)}
                            disabled={!isClaimable}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div
              className="flex flex-col w-full py-8 text-primary overflow-y-scroll rounded-md h-fit p-5"
              style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.25)" }}
            >
              <h2 className="flex font-bold text-xl mb-4 justify-center items-center ">
                Claimable AUDC Tokens
              </h2>
              {isFetching ? (
                <p>Loading claimable tokens...</p>
              ) : (
                <div className="flex flex-col gap-y-4">
                  {claimableAUDCTokens.map((token) => {
                    return (
                      <div
                        key={token.redemptionId}
                        className="p-4 rounded-lg shadow-md bg-primary text-light"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="mb-2">
                              <strong>Redeem Amount:</strong>{" "}
                              {token.redeemAmount} AUDC
                            </p>
                            <p className="mb-2">
                              <strong>RWA burned:</strong> {token.rwaAmountIn}{" "}
                              AYF
                            </p>
                          </div>
                          <Button
                            text="Claim"
                            className={`py-2 ${"bg-[#e6e6e6] text-primary hover:bg-light hover:text-secondary font-semibold"}`}
                            onClick={() => claimRedemption(token.redemptionId)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Contact />
    </>
  );
};

export default Portfolio;
