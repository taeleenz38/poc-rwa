import React from "react";
import Button from "@/app/components/atoms/Buttons/Button";

const PricingSection = () => {
  return (
    <div className="w-1/2 mx-auto text-light flex justify-between items-center mt-8">
      <div className="text-xl font-medium">
        Pending Redemption Requests
      </div>
      <Button
        text="Set Price ID For Redemption"
        className="bg-primary py-2 text-light hover:bg-light hover:text-primary"
        onClick={() => console.log("Approve")}
      />
    </div>
  );
};

export default PricingSection;
