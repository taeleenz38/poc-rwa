import { useState } from "react";
import Pricing from "@/app/components/organisms/Pricing";
import AEMFPricing from "@/app/components/organisms/AEMFPricing";

const FundManagement = () => {
  const [view, setView] = useState("DepositRequests");

  return (
    <div className="text-black flex flex-col border-2 border-[#F5F2F2]">
      <div className="grid grid-cols-2 text-center font-semibold text-primary">
        <div
          className={`p-4 border-b-2 text-sm md:text-base border-[#F5F2F2] ${
            view === "AUDY"
              ? "bg-[#F5F2F2] border-b-primary"
              : "bg-white text-primary cursor-pointer"
          }`}
          onClick={() => setView("AUDY")}
        >
          AUDY Pricing (NAV)
        </div>
        <div
          className={`p-4 border-b-2 text-sm md:text-base border-[#F5F2F2] ${
            view === "AEMF"
              ? "bg-[#F5F2F2] border-b-primary"
              : "bg-white text-primary cursor-pointer"
          }`}
          onClick={() => setView("AEMF")}
        >
          AEMF Pricing (NAV)
        </div>
      </div>
      <div className="p-6">
        {view === "AUDY" && <Pricing />}
        {view === "AEMF" && <AEMFPricing />}
      </div>
    </div>
  );
};

export default FundManagement;
