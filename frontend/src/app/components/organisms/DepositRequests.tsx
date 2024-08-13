import React, { useEffect, useState } from "react";
import SetPriceIdForDepositId from "@/app/components/organisms/Popups/SetPriceIdForDepositId";
import SetClaimTimestamp from "@/app/components/organisms/Popups/SetClaimTimeStamp";
import Button from "@/app/components/atoms/Buttons/Button";

type DepositRequest = {
  user: string;
  depositId: string;
  collateralAmountDeposited: string;
  depositAmountAfterFee: string;
  feeAmount: string;
  priceId?: string;
  claimableTimestamp?: string;
  status?: string;
  price?: string;
  requestTimestamp?: string;
};

const ITEMS_PER_PAGE = 6;
const DepositRequests = () => {
  const [depositRequests, setDepositRequests] = useState<DepositRequest[]>([]);
  const [isSetPriceIdForDepositIdOpen, setIsSetPriceIdForDepositIdOpen] =
    useState(false);
  const [isSetClaimTimestampOpen, setIsSetClaimTimestampOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDepositId, setSelectedDepositId] = useState<
    string | undefined
  >(undefined);
  const [selectedPriceId, setSelectedPriceId] = useState<string | undefined>(
    undefined
  );

  const handleButton1Click = (depositId: string) => {
    setSelectedDepositId(depositId);
    setIsSetClaimTimestampOpen(true);
  };

  const handleButton2Click = (depositId: string, priceId?: string) => {
    setSelectedDepositId(depositId);
    setSelectedPriceId(priceId || "");
    setIsSetPriceIdForDepositIdOpen(true);
  };

  useEffect(() => {
    const fetchDepositRequests = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/pending-deposit-request-list`
        );
        const data = await response.json();

        const sortedData = data.sort((a: DepositRequest, b: DepositRequest) => {
          return parseInt(b.depositId, 16) - parseInt(a.depositId, 16);
        });

        setDepositRequests(sortedData);
      } catch (error) {
        console.error("Error fetching deposit requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepositRequests();
  }, []);

  const hexToDecimal = (hex: string): number => {
    return parseInt(hex, 16);
  };

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

  const paginatedRequests = depositRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-3">
      {loading ? (
        <div className="text-center">Deposit Requests loading...</div>
      ) : (
        <div>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="text-gray text-sm font-semibold bg-[#F5F2F2] border-none">
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
                    key={request.depositId}
                    className="border-b-2 border-[#F5F2F2]  text-sm"
                  >
                    <td className="">{hexToDecimal(request.depositId)}</td>
                    <td className="">{request.user}</td>
                    <td className="">{request.status}</td>
                    <td className="">
                      {request.collateralAmountDeposited} AUDC
                    </td>
                    <td className="">{request.depositAmountAfterFee} AUDC</td>
                    <td className="">
                      {request.priceId ? (
                        request.priceId
                      ) : (
                        <Button
                          text="Set Price ID"
                          className="bg-primary text-light hover:bg-light hover:text-primary rounded-md whitespace-nowrap"
                          onClick={() =>
                            handleButton2Click(
                              request.depositId,
                              request.priceId
                            )
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
                          className="bg-primary py-2 text-light hover:bg-light hover:text-primary rounded-md whitespace-nowrap"
                          onClick={() => handleButton1Click(request.depositId)}
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
    </div>
  );
};

export default DepositRequests;
