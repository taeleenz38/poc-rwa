import React from "react";

type Balance2Props = {
  tokenSymbol: string;
  balanceData:
    | {
        formatted?: string;
      }
    | undefined;
  isLoading: boolean;
};

const Balance2: React.FC<Balance2Props> = ({
  tokenSymbol,
  balanceData,
  isLoading,
}) => {
  const formattedBalance = balanceData?.formatted
    ? parseFloat(balanceData.formatted).toFixed(1)
    : "0.0";

  return (
    <div className="flex">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="text-xl text-primary">
          {formattedBalance} {tokenSymbol}
        </div>
      )}
    </div>
  );
};

export default Balance2;
