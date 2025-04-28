import React, { useEffect, useState } from "react";
import UpdateLR from "@/app/components/organisms/Popups/UpdateLiquidityReport";
import VLRTable from "./VLRTable";
import Button from "../atoms/Buttons/Button";

const Pricing: React.FC = () => {
  const [updateLrOpen, setUpdateLrOpen] = useState(false);

  return (
    <div className="flex flex-col w-full p-4">
      <div className="flex w-full justify-around items-center py-6">
        <Button
          text={"Update Liquidity Report"}
          onClick={() => setUpdateLrOpen(true)}
          className="bg-primary py-3 text-light hover:bg-secondary-focus"
        />
        <UpdateLR
          isOpen={updateLrOpen}
          onClose={() => setUpdateLrOpen(false)}
        />
      </div>
      <div className="overflow-x-auto pt-4">
        <VLRTable />
      </div>
    </div>
  );
};

export default Pricing;
