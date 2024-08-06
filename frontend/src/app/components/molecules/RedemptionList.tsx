import React, { useEffect, useState } from "react";
import Button from "@/app/components/atoms/Buttons/Button";

type RedemptionList = {
  user: string;
  redemptionId: string;
  redeemAmount: number;
  rwaAmountIn: string;
};

const RedemptionList: React.FC = () => {
  const [redemtions, setRedemptions] = useState<RedemptionList[]>([]);
  const [Loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchPriceList = async () => {
      try {
        setLoaded(false);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/pending-approval-redemption-list`
        );

        console.log(response, "response");
        const data = await response.json();
        setRedemptions(data);
      } catch (error) {
        console.error("Error fetching price list:", error);
      } finally {
        setLoaded(true);
      }
    };

    fetchPriceList();
  }, []);

  return (
    <div className="w-full h-3/4 p-4 mx-auto text-primary bg-white flex flex-col mt-8 rounded-md bg-hero-pattern bg-no-repeat bg-right-bottom">
      <div className="text-3xl font-semibold mb-6 text-center mt-4">
        Redemption List
      </div>
      <div className="flex flex-col gap-y-3 h-[80vh] overflow-y-scroll rounded-md p-4">
        {!Loaded && (
          <p className="flex justify-center items-center ">
            <strong>Loading items...</strong>
          </p>
        )}

        {redemtions.length === 0 && Loaded && (
          <p className="flex justify-center items-center ">
            <strong>No Redemption Items found</strong>
          </p>
        )}

        {redemtions.map((item) => (
          <div key={item.user} className="p-4 rounded-lg bg-primary text-light">
            <div>
              <h3 className="text-lg font-medium mb-2 text-secondary">
                <strong>Redemption Id: {item.redemptionId}</strong>
              </h3>
              <p>
                <strong>User:</strong> {item.user}
              </p>
              <p>
                <strong>Redeem Amount:</strong> {item.redeemAmount}
              </p>
              <p>
                <strong>AYF Amount In:</strong> {item.rwaAmountIn}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RedemptionList;
