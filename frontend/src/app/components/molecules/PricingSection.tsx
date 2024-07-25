import React from "react";
import Button from "@/app/components/atoms/Buttons/Button";

const PricingSection = () => {
  return (
    <div className="w-2/3 mx-auto text-light flex justify-between items-center mt-8">
      <div className="w-1/2 mx-auto text-light mt-8 pr-12 border-r-2">
        <div className="flex justify-between items-center">
          <div className="text-xl font-medium">Incoming Deposit Requests</div>
          <div>
            <Button
              text="Set Claim Timestamp"
              className="bg-primary py-2 text-light hover:bg-light hover:text-primary mr-2"
              onClick={() => console.log("Approve")}
            />
            <Button
              text="Set Price ID For Deposit ID"
              className="bg-primary py-2 text-light hover:bg-light hover:text-primary"
              onClick={() => console.log("Approve")}
            />
          </div>
        </div>
      </div>
      <div className="w-1/2 mx-auto text-light mt-8 pl-12">
        <div className="flex justify-between items-center">
          <div className="text-xl font-medium">Pending Redemption Requests</div>
          <Button
            text="Set Price ID For Redemption"
            className="bg-primary py-2 text-light hover:bg-light hover:text-primary"
            onClick={() => console.log("Approve")}
          />
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
