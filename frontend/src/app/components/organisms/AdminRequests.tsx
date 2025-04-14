import { useState } from "react";
import { Provider } from "urql";
import { eqv } from "@/lib/urql";
import DepositRequests from "./DepositRequests";
import DepositRequestsEQV from "./DepositRequestsEQV";
import RedemptionRequests from "./RedemptionRequests";
import RedemptionRequestsEQV from "./RedemptionRequestsEQV";

type AdminRequestsProps = {
  tokenType: "VLR" | "EQV";
};

const AdminRequests = ({ tokenType }: AdminRequestsProps) => {
  const [view, setView] = useState("DepositRequests");

  return (
    <div className="text-black flex flex-col border-2 border-[#F5F2F2]">
      <div className="grid grid-cols-2 text-center font-semibold text-primary">
        <div
          className={`p-4 border-b-2 border-r-2 text-sm md:text-base border-[#F5F2F2] ${view === "DepositRequests"
            ? "bg-[#F5F2F2] border-b-primary"
            : "bg-white text-primary cursor-pointer"
            }`}
          onClick={() => setView("DepositRequests")}
        >
          Deposit Requests
        </div>
        <div
          className={`p-4 pr-2 md:pr-0 border-b-2 border-r-2 text-sm md:text-base border-[#F5F2F2] ${view === "RedemptionRequests"
            ? "bg-[#F5F2F2] border-b-primary"
            : "bg-white text-primary cursor-pointer"
            }`}
          onClick={() => setView("RedemptionRequests")}
        >
          Redemption Requests
        </div>
      </div>

      <div className="p-6">
        {view === "DepositRequests" &&
          (tokenType === "VLR" ? (
            <DepositRequests />
          ) : (
            <Provider value={eqv}>
              <DepositRequestsEQV />
            </Provider>
          ))}
        {view === "RedemptionRequests" &&
          (tokenType === "VLR" ? (
            <RedemptionRequests />
          ) : (
            <Provider value={eqv}>
              <RedemptionRequestsEQV />
            </Provider>
          ))}
      </div>
    </div>
  );
};

export default AdminRequests;
