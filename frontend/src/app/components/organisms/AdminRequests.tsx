import { useState } from "react";
import DepositRequests from "@/app/components/organisms/DepositRequests";
import RedemptionRequests from "@/app/components/organisms/RedemptionRequests";
import Pricing from "@/app/components/organisms/Pricing";

const AdminRequests = () => {
  const [view, setView] = useState("DepositRequests");

  return (
    <div className="text-black flex flex-col border-2 border-[#F5F2F2]">
      <div className="grid grid-cols-3 text-center  font-semibold text-[#ba745f]">
        <div
          className={`p-4 border-b-2 border-r-2 border-[#F5F2F2] ${
            view === "DepositRequests"
              ? "bg-[#F5F2F2] border-b-[#ba745f] "
              : "bg-white text-primary cursor-pointer"
          }`}
          onClick={() => setView("DepositRequests")}
        >
          Deposit Requests
        </div>
        <div
          className={`p-4 border-b-2 border-r-2 border-[#F5F2F2] ${
            view === "RedemptionRequests"
              ? "bg-[#F5F2F2] border-b-[#ba745f] "
              : "bg-white text-primary cursor-pointer"
          }`}
          onClick={() => setView("RedemptionRequests")}
        >
          Redemption Requests
        </div>
        <div
          className={`p-4 border-b-2 border-[#F5F2F2] ${
            view === "Pricing"
              ? "bg-[#F5F2F2] border-b-[#ba745f] "
              : "bg-white text-primary cursor-pointer"
          }`}
          onClick={() => setView("Pricing")}
        >
          Pricing
        </div>
      </div>
      <div className="p-6">
        {view === "DepositRequests" && <DepositRequests />}
        {view === "RedemptionRequests" && <RedemptionRequests />}
        {view === "Pricing" && <Pricing />}
      </div>
    </div>
  );
};

export default AdminRequests;
