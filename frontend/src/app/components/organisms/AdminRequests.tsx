import { useState } from "react";
import DepositRequests from "@/app/components/organisms/DepositRequests";
import RedemptionRequests from "@/app/components/organisms/RedemptionRequests";

const AdminRequests = () => {
  const [view, setView] = useState("DepositRequests");

  return (
    <div className="text-black flex flex-col border-2 border-[#F5F2F2]">
      <div className="grid grid-cols-2 text-center font-semibold text-primary">
        <div
          className={`p-4 border-b-2 border-r-2 text-sm md:text-base border-[#F5F2F2] ${
            view === "DepositRequests"
              ? "bg-[#F5F2F2] border-b-primary "
              : "bg-white text-primary cursor-pointer"
          }`}
          onClick={() => setView("DepositRequests")}
        >
          Deposit Requests
        </div>
        <div
          className={`p-4 pr-2 md:pr-0 border-b-2 border-r-2 text-sm md:text-base border-[#F5F2F2] ${
            view === "RedemptionRequests"
              ? "bg-[#F5F2F2] border-b-primary"
              : "bg-white text-primary cursor-pointer"
          }`}
          onClick={() => setView("RedemptionRequests")}
        >
          Redemption Requests
        </div>
      </div>
      <div className="p-6">
        {view === "DepositRequests" && <DepositRequests />}
        {view === "RedemptionRequests" && <RedemptionRequests />}
      </div>
    </div>
  );
};

export default AdminRequests;
