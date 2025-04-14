import React, { useEffect, useState } from "react";
import Button from "@/app/components/atoms/Buttons/Button";
import { GET_PENDING_APPROVAL_REDEMPTION_LIST } from "@/lib/urqlQueries";
import { useQuery } from "urql";

type RedemptionListData = {
  redemptionRequests: {
    id: string;
    user: string;
    rwaAmountIn: string;
    redeemAmount: number;
  }[];
};

const RedemptionList: React.FC = () => {
  const [Loaded, setLoaded] = useState(false);

  const [{ data, fetching, error }] = useQuery<RedemptionListData>({
    query: GET_PENDING_APPROVAL_REDEMPTION_LIST,
  });

  return (
    <div className="w-full h-3/4 p-4 mx-auto text-primary bg-white flex flex-col mt-8 rounded-md bg-no-repeat bg-right-bottom">
      <div className="text-3xl font-semibold mb-6 text-center mt-4">
        Redemption List
      </div>
      <div className="flex flex-col gap-y-3 h-[80vh] overflow-y-scroll rounded-md p-4">
        {!Loaded && (
          <p className="flex justify-center items-center ">
            <strong>Loading items...</strong>
          </p>
        )}

        {!data ||
          (!data.redemptionRequests && (
            <p className="flex justify-center items-center ">
              <strong>No Redemption Items found</strong>
            </p>
          ))}

        {data?.redemptionRequests.map((item) => (
          <div key={item.user} className="p-4 rounded-lg bg-primary text-light">
            <div>
              <h3 className="text-lg font-medium mb-2 text-secondary">
                <strong>Redemption Id: {item.id}</strong>
              </h3>
              <p>
                <strong>User:</strong> {item.user}
              </p>
              <p>
                <strong>Redeem Amount:</strong> {item.redeemAmount}
              </p>
              <p>
                <strong>VLR Amount In:</strong> {item.rwaAmountIn}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RedemptionList;
