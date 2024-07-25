import React from "react";

type BalanceProps = {
  tokenSymbol: string;
  balanceData: {
    formatted?: string;
  } | undefined;
  isLoading: boolean;
};

const Balance: React.FC<BalanceProps> = ({ tokenSymbol, balanceData, isLoading }) => {
  const formattedBalance = balanceData?.formatted
    ? parseFloat(balanceData.formatted).toFixed(3)
    : "0.000";

  return (
    <div>
      <h2 className="font-semibold text-2xl mt-12 mb-3">{tokenSymbol} Balance</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="text-2xl">{formattedBalance} ${tokenSymbol}</div>
      )}
    </div>
  );
};

export default Balance;
