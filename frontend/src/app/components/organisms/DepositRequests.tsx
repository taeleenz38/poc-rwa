import React, { useEffect, useState } from "react";
import SetPriceIdForDepositId from "@/app/components/organisms/Popups/SetPriceIdForDepositId";
import SetClaimTimestamp from "@/app/components/organisms/Popups/SetClaimTimeStamp";
import SetMintFee from "./Popups/SetMintFee";
import Button from "@/app/components/atoms/Buttons/Button";
import { GET_PENDING_DEPOSIT_REQUESTS } from "@/lib/urqlQueries";
import { useQuery } from "urql";
import { ethers } from "ethers";

type DepositRequest = {
  user: string;
  id: string;
  collateralAmountDeposited: string;
  depositAmountAfterFee: string;
  feeAmount: string;
  priceId?: string;
  claimableTimestamp?: string;
  status?: string;
  price?: string;
  requestTimestamp?: string;
};

// Convert wei to ether
const weiToEther = (wei: string | number): string => {
  return ethers.utils.formatUnits(wei, 18);
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

const ITEMS_PER_PAGE = 6;
const DepositRequests = () => {
  const [isSetPriceIdForDepositIdOpen, setIsSetPriceIdForDepositIdOpen] =
    useState(false);
  const [isSetClaimTimestampOpen, setIsSetClaimTimestampOpen] = useState(false);
  const [isSetMintFeeOpen, setIsSetMintFeeOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDepositId, setSelectedDepositId] = useState<
    string | undefined
  >(undefined);
  const [selectedPriceId, setSelectedPriceId] = useState<string | undefined>(
    undefined
  );

  const [
    { data: depositData, fetching: fetchingDeposits, error: depositError },
  ] = useQuery({
    query: GET_PENDING_DEPOSIT_REQUESTS,
  });

  const handleButton1Click = (depositId: string) => {
    setSelectedDepositId(depositId);
    setIsSetClaimTimestampOpen(true);
  };

  const handleButton2Click = (depositId: string, priceId?: string) => {
    setSelectedDepositId(depositId);
    setSelectedPriceId(priceId || "");
    setIsSetPriceIdForDepositIdOpen(true);
  };

  const depositRequests: DepositRequest[] =
    depositData?.pendingDepositRequests || [];

  const hexToDecimal = (hex: string): number => {
    return parseInt(hex, 16);
  };

  const sortedDepositRequests = [...depositRequests].sort((a, b) => {
    const timestampA = a.requestTimestamp ? new Date(a.requestTimestamp).getTime() : 0;
    const timestampB = b.requestTimestamp ? new Date(b.requestTimestamp).getTime() : 0;
    return timestampB - timestampA;
  });

  const totalPages = Math.ceil(depositRequests.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const paginatedRequests = sortedDepositRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  return (
    <div className="p-4">
      {/* <div className="w-full flex justify-center py-6">
        <Button
          text={"Set Mint Fee"}
          onClick={() => setIsSetMintFeeOpen(true)}
          className="bg-primary py-2 text-light hover:bg-light hover:text-primary rounded-md"
        />
      </div> */}
      {fetchingDeposits ? (
        <div className="text-center">Deposit Requests loading...</div>
      ) : (
        <div>
          <div className="overflow-x-auto pt-4">
            <table className="table w-full">
              <thead>
                <tr className="text-secondary text-sm font-semibold bg-[#F5F2F2] border-none">
                  <th className="">ID</th>
                  <th className="">User</th>
                  <th className="">
                    Request
                    <br /> Status
                  </th>
                  <th className="">
                    Amount
                    <br /> Deposited
                  </th>
                  <th className="">
                    Amount
                    <br /> After Fee
                  </th>
                  <th className="">Price ID</th>
                  <th className="">Claim Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b-2 border-[#F5F2F2]  text-sm"
                  >
                    <td className="">{hexToDecimal(request.id)}</td>
                    <td className="">{request.user}</td>
                    <td className="">{request.status}</td>
                    <td className="">
                      {formatNumber(
                        weiToEther(request.collateralAmountDeposited)
                      )}{" "}
                      AUDC
                    </td>
                    <td className="">
                      {formatNumber(weiToEther(request.depositAmountAfterFee))}{" "}
                      AUDC
                    </td>
                    <td className="">
                      {request.priceId ? (
                        request.priceId
                      ) : (
                        <Button
                          text="Set Price ID"
                          className="bg-primary text-light hover:bg-secondary-focus whitespace-nowrap"
                          onClick={() =>
                            handleButton2Click(request.id, request.priceId)
                          }
                        />
                      )}
                    </td>
                    <td className="">
                      {request.claimableTimestamp ? (
                        request.claimableTimestamp
                      ) : (
                        <Button
                          text="Set Claim Timestamp"
                          className="bg-primary py-2 text-light hover:bg-secondary-focus whitespace-nowrap"
                          onClick={() => handleButton1Click(request.id)}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex w-full md:w-1/3 mx-auto justify-between items-center mt-8">
            <button
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-300 text-secondary cursor-not-allowed"
                  : "bg-light text-primary"
              }`}
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <div>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`mx-1 px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? "bg-primary text-secondary"
                      : "bg-light text-primary"
                  }`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-light text-primary"
              }`}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
      <SetClaimTimestamp
        isOpen={isSetClaimTimestampOpen}
        onClose={() => setIsSetClaimTimestampOpen(false)}
        depositId={selectedDepositId}
      />
      <SetPriceIdForDepositId
        isOpen={isSetPriceIdForDepositIdOpen}
        onClose={() => setIsSetPriceIdForDepositIdOpen(false)}
        depositId={selectedDepositId}
      />
      <SetMintFee
        isOpen={isSetMintFeeOpen}
        onClose={() => setIsSetMintFeeOpen(false)}
      />
    </div>
  );
};

export default DepositRequests;
