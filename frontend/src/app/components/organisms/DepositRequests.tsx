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
};


const DepositRequests = () => {
  const [depositRequests, setDepositRequests] = useState<DepositRequest[]>([]);
  const [isSetPriceIdForDepositIdOpen, setIsSetPriceIdForDepositIdOpen] =
    useState(false);
  const [isSetClaimTimestampOpen, setIsSetClaimTimestampOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleButton1Click = () => {
    setIsSetClaimTimestampOpen(true);
  };

  const handleButton2Click = () => {
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

  return (
    <div className="p-3">
      {loading ? (
        <div className="text-center">Deposit Requests loading...</div>
      ) : (
        <table className="table w-full">
          <thead>
            <tr className="text-gray text-lg bg-[#F5F2F2] border-none">
              <th className="w-1/12">ID</th>
              <th className="w-1/6">User</th>
              <th className="w-1/6">Amount Deposited</th>
              <th className="w-1/6">Amount After Fee</th>
              <th className="w-1/6">Price ID</th>
              <th className="w-1/4">Claim Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {depositRequests.map((request) => (
              <tr
                key={request.depositId}
                className="border-b-2 border-[#F5F2F2] font-medium"
              >
                <td>{hexToDecimal(request.depositId)}</td>
                <td>{request.user}</td>
                <td>{request.collateralAmountDeposited} AUDC</td>
                <td>{request.depositAmountAfterFee} AUDC</td>
                <td>
                  <Button
                    text="Set Price ID"
                    className="bg-primary py-2 text-light hover:bg-light hover:text-primary rounded-md"
                    onClick={handleButton2Click}
                  />
                </td>
                <td>
                  <Button
                    text="Set Claim Timestamp"
                    className="bg-primary py-2 text-light hover:bg-light hover:text-primary rounded-md"
                    onClick={handleButton1Click}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <SetClaimTimestamp
        isOpen={isSetClaimTimestampOpen}
        onClose={() => setIsSetClaimTimestampOpen(false)}
      />
      <SetPriceIdForDepositId
        isOpen={isSetPriceIdForDepositIdOpen}
        onClose={() => setIsSetPriceIdForDepositIdOpen(false)}
      />
    </div>
  );
};

export default DepositRequests;
