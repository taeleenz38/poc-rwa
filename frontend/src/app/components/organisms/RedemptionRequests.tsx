import React, { useEffect, useState } from "react";
import Button from "@/app/components/atoms/Buttons/Button";
import SetPriceIdForRedemptionId from "@/app/components/organisms/Popups/SetPriceIdForRedemptionId";

type RedemptionRequest = {
  user: string;
  redemptionId: string;
  rwaAmountIn: string;
  priceId?: string;
  requestTimestamp?: string;
  price?: string;
  requestedRedeemAmount?: string;
  requestedRedeemAmountAfterFee?: string;
  feeAmount?: string;
  status?: string;
};

const ITEMS_PER_PAGE = 6;

const RedemptionRequests = () => {
  const [loading, setLoading] = useState(true);
  const [redemptionRequests, setRedemptionRequests] = useState<
    RedemptionRequest[]
  >([]);
  const [selectedRedemptionId, setSelectedRedemptionId] = useState<
    string | undefined
  >(undefined);
  const [isSetPriceIdForRedemptionIdOpen, setIsSetPriceIdForRedemptionIdOpen] =
    useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleButtonClick = () => {
    setIsSetPriceIdForRedemptionIdOpen(true);
  };

  useEffect(() => {
    const fetchRedemptionRequests = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/pending-redemption-request-list`
        );
        const data = await response.json();

        const sortedData = data.sort(
          (a: RedemptionRequest, b: RedemptionRequest) => {
            return parseInt(b.redemptionId, 16) - parseInt(a.redemptionId, 16);
          }
        );

        setRedemptionRequests(sortedData);
      } catch (error) {
        console.error("Error fetching redemptions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRedemptionRequests();
  }, []);

  const hexToDecimal = (hex: string): number => {
    return parseInt(hex, 16);
  };

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

  const paginatedRequests = redemptionRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-3">
      {loading ? (
        <div className="text-center">Redemption Requests loading...</div>
      ) : (
        <div>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="text-gray text-lg bg-[#F5F2F2] border-none">
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
                    key={request.redemptionId}
                    className="border-b-2 border-[#F5F2F2] font-medium"
                  >
                    <td>{hexToDecimal(request.redemptionId)}</td>
                    <td>{request.user}</td>
                    <td>{request.status}</td>
                    <td>{request.rwaAmountIn} AYF</td>
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
                          onClick={handleButtonClick}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex w-1/3 mx-auto justify-between items-center mt-8">
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
      />
    </div>
  );
};

export default RedemptionRequests;
