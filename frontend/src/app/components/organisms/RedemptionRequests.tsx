import React, { useEffect, useState } from "react";
import Button from "@/app/components/atoms/Buttons/Button";
import SetPriceIdForRedemptionId from "@/app/components/organisms/Popups/SetPriceIdForRedemptionId";
import SetRedemptionFee from "./Popups/SetRedemptionFee";
import { useQuery } from "urql";
import { GET_PENDING_REDEMPTION_REQUEST_LIST } from "@/lib/urqlQueries";
import { ethers } from "ethers";

type RedemptionRequest = {
  id: string;
  user: string;
  rwaAmountIn: string;
  priceId: string;
  requestTimestamp: string;
  price: string;
  requestedRedeemAmount: string;
  requestedRedeemAmountAfterFee: string;
  feeAmount: string;
  status: string;
  redeemAmount: string;
  claimApproved: boolean;
  displayId: string;
  collateralType: string;
  tokenAmount: string;
  redemptionId: string;
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

const RedemptionRequests = () => {
  const [selectedRedemptionId, setSelectedRedemptionId] = useState<
    string | undefined
  >(undefined);
  const [selectedCollateralType, setSelectedCollateralType] = useState<
    string | undefined
  >(undefined);
  const [isSetPriceIdForRedemptionIdOpen, setIsSetPriceIdForRedemptionIdOpen] =
    useState(false);
  const [isRedemptionFeeOpen, setIsRedemptionFeeOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [
    {
      data: redemptionData,
      fetching: fetchingRedemptions,
      error: redemptionError,
    },
  ] = useQuery({
    query: GET_PENDING_REDEMPTION_REQUEST_LIST,
  });

  const handleButtonClick = (redemptionId: string, collateralType: string) => {
    console.log("redemptionId", redemptionId);
    console.log("collateralType", collateralType);
    setSelectedRedemptionId(redemptionId);
    setSelectedCollateralType(collateralType);
    setIsSetPriceIdForRedemptionIdOpen(true);
  };

  const redemptionRequests: RedemptionRequest[] =
    redemptionData?.redemptionRequests || [];

  const hexToDecimal = (hex: string): number => {
    return parseInt(hex, 16);
  };

  const sortedRedemptionRequests = [...redemptionRequests].sort((a, b) => {
    const timestampA = a.requestTimestamp
      ? new Date(a.requestTimestamp).getTime()
      : 0;
    const timestampB = b.requestTimestamp
      ? new Date(b.requestTimestamp).getTime()
      : 0;
    return timestampB - timestampA;
  });

  const totalPages = Math.ceil(redemptionRequests.length / ITEMS_PER_PAGE);

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

  const paginatedRequests = sortedRedemptionRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-4">
      {/* <div className="w-full flex justify-center py-6">
        <Button
          text={"Set Redemption Fee"}
          onClick={() => setIsRedemptionFeeOpen(true)}
          className="bg-primary py-2 text-light hover:bg-light hover:text-primary rounded-md"
        />
      </div> */}
      {fetchingRedemptions ? (
        <div className="text-center">Redemption Requests loading...</div>
      ) : (
        <div>
          <div className="overflow-x-auto pt-4">
            <table className="table w-full">
              <thead>
                <tr className="text-gray text-sm font-semibold bg-[#F5F2F2] border-none">
                  <th>ID</th>
                  <th>User</th>
                  <th>
                    Request <br /> Status
                  </th>
                  <th>
                    AYF Redemption
                    <br />
                    Requested
                  </th>
                  <th>
                    Redemption <br /> Amount
                  </th>
                  <th>Price ID</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b-2 border-[#F5F2F2] text-sm"
                  >
                    <td>
                      {(() => {
                        const [hexPart, token] = request.displayId.split("-");
                        const decimalNumber = parseInt(hexPart, 16);
                        return `${decimalNumber}-${token}`;
                      })()}
                    </td>
                    <td>{request.user}</td>
                    <td>{request.status}</td>
                    <td>{formatNumber(weiToEther(request.rwaAmountIn))} AYF</td>
                    <td>
                      {request.requestedRedeemAmountAfterFee
                        ? `${request.requestedRedeemAmountAfterFee} AUDC`
                        : "Pending Redemption"}
                    </td>
                    <td>
                      {request.priceId ? (
                        request.priceId
                      ) : (
                        <Button
                          text="Set Price ID"
                          className="bg-primary text-light hover:bg-light hover:text-primary rounded-md whitespace-nowrap"
                          onClick={() =>
                            handleButtonClick(
                              request.redemptionId,
                              request.collateralType
                            )
                          }
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
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
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
                      ? "bg-primary text-light"
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
      <SetPriceIdForRedemptionId
        isOpen={isSetPriceIdForRedemptionIdOpen}
        onClose={() => setIsSetPriceIdForRedemptionIdOpen(false)}
        redemptionId={selectedRedemptionId}
        collateralType={selectedCollateralType}
      />
      <SetRedemptionFee
        isOpen={isRedemptionFeeOpen}
        onClose={() => setIsRedemptionFeeOpen(false)}
      />
    </div>
  );
};

export default RedemptionRequests;
