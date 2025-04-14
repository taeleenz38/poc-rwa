import { useState } from "react";
import Pricing from "@/app/components/organisms/Pricing";
import EQVPricing from "@/app/components/organisms/EQVPricing";

const FundManagement = () => {
  const [view, setView] = useState("DepositRequests");

  return (
    <div className="text-black flex flex-col border-2 border-[#F5F2F2]">
      <div className="grid grid-cols-2 text-center font-semibold text-primary">
        <div
          className={`p-4 border-b-2 text-sm md:text-base border-[#F5F2F2] ${
            view === "VLR"
              ? "bg-[#F5F2F2] border-b-primary"
              : "bg-white text-primary cursor-pointer"
          }`}
          onClick={() => setView("VLR")}
        >
          VLR Pricing (NAV)
        </div>
        <div
          className={`p-4 border-b-2 text-sm md:text-base border-[#F5F2F2] ${
            view === "EQV"
              ? "bg-[#F5F2F2] border-b-primary"
              : "bg-white text-primary cursor-pointer"
          }`}
          onClick={() => setView("EQV")}
        >
          EQV Pricing (NAV)
        </div>
      </div>
      <div className="p-6">
        {view === "VLR" && <Pricing />}
        {view === "EQV" && <EQVPricing />}
      </div>
    </div>
  );
};

export default FundManagement;
