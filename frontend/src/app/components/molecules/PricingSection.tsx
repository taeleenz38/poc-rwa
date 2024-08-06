import React, { useEffect, useState } from "react";
import Button from "@/app/components/atoms/Buttons/Button";
import SetPriceIdForDepositId from "@/app/components/organisms/Popups/SetPriceIdForDepositId";
import SetClaimTimestamp from "../organisms/Popups/SetClaimTimeStamp";

// Define the type for the deposit request
type DepositRequest = {
  user: string;
  depositId: string;
  collateralAmountDeposited: string;
  depositAmountAfterFee: string;
  feeAmount: string;
  priceId?: string;
};

const PricingSection = () => {
  const [depositRequests, setDepositRequests] = useState<DepositRequest[]>([]);
  const [isSetPriceIdForDepositIdOpen, setIsSetPriceIdForDepositIdOpen] =
    React.useState(false);
  const [isSetClaimTimestampOpen, setIsSetClaimTimestampOpen] =
    React.useState(false);

  const handleButton1Click = () => {
    setIsSetClaimTimestampOpen(true);
  };

  const handleButton2Click = () => {
    setIsSetPriceIdForDepositIdOpen(true);
  };

  useEffect(() => {
    const fetchDepositRequests = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/pending-deposit-request-list`
        );
        const data = await response.json();
        setDepositRequests(data);
      } catch (error) {
        console.error("Error fetching deposit requests:", error);
      }
    };

    fetchDepositRequests();
  }, []);

  const hexToDecimal = (hex: string): number => {
    return parseInt(hex, 16);
  };

  return (
    <div className="w-11/12 mx-auto text-primary flex justify-between mt-8">
      <div className="w-[48%] mx-auto text-primary mt-8 shadow-lg p-4 rounded-md">
        <div className="flex justify-between items-center mb-6">
          <div className="text-xl font-bold">Incoming Deposit Requests</div>
          <div>
            <Button
              text="Set Claim Timestamp"
              className="bg-primary py-2 text-light hover:bg-light hover:text-primary mr-2"
              onClick={handleButton1Click}
            />
            <Button
              text="Set Price ID For Deposit ID"
              className="bg-primary py-2 text-light hover:bg-light hover:text-primary"
              onClick={handleButton2Click}
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-4 max-h-[80vh] overflow-y-scroll">
          {depositRequests.map((request) => (
            <div key={request.depositId} className="p-4 rounded-lg shadow-md bg-primary text-light">
              <h3 className="text-lg font-bold mb-2 text-secondary">
                Deposit ID: {hexToDecimal(request.depositId)}
              </h3>
              <p>
                <strong>User:</strong> {request.user}
              </p>
              <p>
                <strong>Collateral Amount Deposited:</strong>{" "}
                {request.collateralAmountDeposited} AUDC
              </p>
              <p>
                <strong>Deposit Amount After Fee:</strong>{" "}
                {request.depositAmountAfterFee} AUDC
              </p>
              <p>
                <strong>Fee Amount:</strong> {request.feeAmount} AUDC
              </p>
              {request.priceId && (
                <p>
                  <strong>Price ID:</strong> {request.priceId}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="w-[48%] mx-auto text-primary mt-8 shadow-lg p-4 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-bold">
            Pending Redemption Requests
          </div>
          <Button
            text="Set Price ID For Redemption"
            className="bg-primary py-2 text-light hover:bg-light hover:text-primary"
            onClick={() => console.log("Approve")}
          />
        </div>
        {/* Add similar card mapping for pending redemption requests if needed */}
      </div>
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

export default PricingSection;
