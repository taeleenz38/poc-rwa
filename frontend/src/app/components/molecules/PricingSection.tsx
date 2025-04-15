import React, { useEffect, useState } from "react";
import Button from "@/app/components/atoms/Buttons/Button";
import SetPriceIdForDepositId from "@/app/components/organisms/Popups/ApproveDepositRequest";
import SetPriceIdForRedemptionId from "@/app/components/organisms/Popups/SetPriceIdForRedemptionId";
import SetClaimTimestamp from "@/app/components/organisms/Popups/SetClaimTimeStamp";
import {
  GET_PENDING_DEPOSIT_REQUESTS,
  GET_PENDING_REDEMPTION_REQUEST_LIST,
} from "@/lib/urqlQueries";
import { useQuery } from "urql";

// Define the type for the deposit request
type DepositRequest = {
  id: string;
  user: string;
  collateralAmountDeposited: string;
  depositAmountAfterFee: string;
  feeAmount: string;
  priceId?: string;
  claimableTimestamp: string;
  requestTimestamp: string;
};

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
};

const PricingSection = () => {
  const [Loaded, setLoaded] = useState(false);
  const [isSetPriceIdForDepositIdOpen, setIsSetPriceIdForDepositIdOpen] =
    React.useState(false);
  const [isSetClaimTimestampOpen, setIsSetClaimTimestampOpen] =
    React.useState(false);
  const [isSetPriceIdForRedemptionIdOpen, setIsSetPriceIdForRedemptionIdOpen] =
    React.useState(false);

  const [
    { data: depositData, fetching: fetchingDeposits, error: depositError },
  ] = useQuery({
    query: GET_PENDING_DEPOSIT_REQUESTS,
  });

  const [
    {
      data: redemptionData,
      fetching: fetchingRedemptions,
      error: redemptionError,
    },
  ] = useQuery({
    query: GET_PENDING_REDEMPTION_REQUEST_LIST,
  });

  const handleButton1Click = () => {
    setIsSetClaimTimestampOpen(true);
  };

  const handleButton2Click = () => {
    setIsSetPriceIdForDepositIdOpen(true);
  };

  const handleButton3Click = () => {
    setIsSetPriceIdForRedemptionIdOpen(true);
  };

  const depositRequests: DepositRequest[] =
    depositData?.pendingDepositRequests || [];

  const redemptionRequests: RedemptionRequest[] =
    redemptionData?.redemptionRequests || [];

  const hexToDecimal = (hex: string): number => {
    return parseInt(hex, 16);
  };

  return (
    <div className="w-11/12 mx-auto text-primary flex justify-between mt-8">
      <div className="w-[48%] mx-auto text-primary mt-8 shadow-md shadow-primary p-4 rounded-md">
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
            <div
              key={request.id}
              className="p-4 rounded-lg shadow-md bg-primary text-light"
            >
              <h3 className="text-lg font-bold mb-2 text-secondary">
                Deposit ID: {hexToDecimal(request.id)}
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
              {request.priceId && (
                <p>
                  <strong>Price ID:</strong> {request.priceId}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="w-[48%] mx-auto text-primary mt-8 shadow-md shadow-primary p-4 rounded-md">
        <div className="flex justify-between items-center mb-6">
          <div className="text-xl font-bold">Pending Redemption Requests</div>
          <Button
            text="Set Price ID For Redemption"
            className="bg-primary py-2 text-light hover:bg-light hover:text-primary"
            onClick={handleButton3Click}
          />
        </div>
        <div className="flex flex-col gap-y-4 max-h-[80vh] overflow-y-scroll">
          {redemptionRequests.map((request) => (
            <div
              key={request.id}
              className="p-4 rounded-lg shadow-md bg-primary text-light"
            >
              <h3 className="text-lg font-bold mb-2 text-secondary">
                Redemption ID: {request.id}
              </h3>
              <p>
                <strong>User:</strong> {request.user}
              </p>
              <p>
                <strong>Redeem Amount:</strong> {request.redeemAmount} AUDC
              </p>
              <p>
                <strong>VLR Amount In:</strong> {request.rwaAmountIn}
              </p>
              <div></div>
            </div>
          ))}
        </div>
      </div>
      <SetClaimTimestamp
        isOpen={isSetClaimTimestampOpen}
        onClose={() => setIsSetClaimTimestampOpen(false)}
      />
      <SetPriceIdForDepositId
        isOpen={isSetPriceIdForDepositIdOpen}
        onClose={() => setIsSetPriceIdForDepositIdOpen(false)}
      />
      <SetPriceIdForRedemptionId
        isOpen={isSetPriceIdForRedemptionIdOpen}
        onClose={() => setIsSetPriceIdForRedemptionIdOpen(false)}
      />
    </div>
  );
};

export default PricingSection;
