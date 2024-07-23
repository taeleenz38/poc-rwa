import React from "react";
import Disclaimer from "@/app/components/molecules/disclaimer";
import FundDetails from "@/app/components/organisms/FundDetails";
import FundDescription from "@/app/components/organisms/FundDescription";

const Invest = () => {
  return (
    <div>
      <Disclaimer />
      <FundDetails />
      <FundDescription />
    </div>
  );
};

export default Invest;
