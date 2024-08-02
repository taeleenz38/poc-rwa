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
    <div className="flex">
      <h2 className="font-semibold text-2xl  mr-4 text-white">
        {tokenSymbol} Balance
      </h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="text-2xl  text-white">
          {formattedBalance} {tokenSymbol}
        </div>
      )}
    </div>
  );
};

export default Balance;
