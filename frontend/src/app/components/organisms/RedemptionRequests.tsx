import React, { useEffect, useState } from "react";
import Button from "@/app/components/atoms/Buttons/Button";
import SetPriceIdForRedemptionId from "@/app/components/organisms/Popups/SetPriceIdForRedemptionId";

type RedemptionRequest = {
  user: string;
  redemptionId: string;
  redeemAmount: number;
  rwaAmountIn: string;
};

const RedemptionRequests = () => {
  const [loading, setLoading] = useState(true);
  const [redemptionRequests, setRedemptionRequests] = useState<
    RedemptionRequest[]
  >([]);
  const [isSetPriceIdForRedemptionIdOpen, setIsSetPriceIdForRedemptionIdOpen] =
    React.useState(false);

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

  return (
    <div className="p-6">
      {loading ? (
        <div className="text-center">Redemption Requests loading...</div>
      ) : (
        <table className="table w-full">
          <thead>
            <tr className="text-gray text-lg bg-[#F5F2F2] border-none">
              <th>Redemption ID</th>
              <th>User</th>
              <th>Redeem Amount</th>
              <th>RWA Burned</th>
              <th>Price ID</th>
            </tr>
          </thead>
          <tbody>
            {redemptionRequests.map((request) => (
              <tr
                key={request.redemptionId}
                className="border-b-2 border-[#F5F2F2] font-medium"
              >
                <td>{hexToDecimal(request.redemptionId)}</td>
                <td>{request.user}</td>
                <td>{request.redeemAmount} AUDC</td>
                <td>{request.rwaAmountIn} AYF</td>
                <td>
                  <Button
                    text="Set Price ID"
                    className="bg-primary py-2 text-light hover:bg-light hover:text-primary rounded-md"
                    onClick={handleButtonClick}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <SetPriceIdForRedemptionId
        isOpen={isSetPriceIdForRedemptionIdOpen}
        onClose={() => setIsSetPriceIdForRedemptionIdOpen(false)}
      />
    </div>
  );
};

export default RedemptionRequests;
