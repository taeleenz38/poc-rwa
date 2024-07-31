import React from "react";

type BalanceProps = {
  tokenSymbol: string;
  balanceData:
    | {
        formatted?: string;
      }
    | undefined;
  isLoading: boolean;
};

const Balance: React.FC<BalanceProps> = ({
  tokenSymbol,
  balanceData,
  isLoading,
}) => {
  const formattedBalance = balanceData?.formatted
    ? parseFloat(balanceData.formatted).toFixed(1)
    : "0.0";

  return (
    <div className="px-96 mb-4">
      <div className="flex">
        <h2 className="font-semibold text-2xl mb-3 mr-8">
          {tokenSymbol} Balance
        </h2>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="text-2xl mb-3">
            {formattedBalance} {tokenSymbol}
          </div>
        )}
      </div>
    </div>
  );
};

export default Balance;
