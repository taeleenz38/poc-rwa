import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "../atoms/Buttons/Button";
import AllowlistPopUp from "./Popups/AllowlistPopUp";
import AddPrice from "./Popups/SetPrice";
import UpdatePrice from "./Popups/UpdatePrice";

interface PricingResponse {
  priceId: string;
  price: string;
  status: string;
  date: string;
}

const Pricing = () => {
  const [prices, setPrices] = useState<PricingResponse[]>([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [addPriceOprn, setAddPriceOpen] = useState(false);
  const [UpdatePriceOprn, setUpdatePriceOpen] = useState(false);
  const [selectedPriceIndex, setSelectedPriceIndex] = useState<number | null>(
    null
  );

  const handleRadioChange = (index: number) => {
    if (index === selectedPriceIndex) {
      //setSelectedPriceIndex(null);
    } else {
      setSelectedPriceIndex(index);
    }
  };

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        setIsTableLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/price-list`
        );
        setPrices(response.data);
        console.log(response.data, "price");
      } catch (error) {
        console.error("Error fetching wallets:", error);
      } finally {
        setIsTableLoading(false);
      }
    };

    fetchWallets();
  }, []);

  if (isTableLoading) {
    return (
      <div className="flex justify-center items-center flex-col w-full p-4">
        <div className=" text-base">Pricing Data Loading....</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full p-4">
      <div className="flex w-full justify-around items-center py-6">
        <Button
          text={"Add New Price ID"}
          onClick={() => setAddPriceOpen(true)}
          className="bg-primary py-2 text-light hover:bg-light hover:text-primary rounded-md"
        />
        <Button
          text={"Update Existing Price ID"}
          onClick={() => setUpdatePriceOpen(true)}
          className={`${
            selectedPriceIndex === null
              ? `bg-gray/20 text-primary`
              : "bg-primary text-light hover:bg-light hover:text-primary"
          }  py-2  rounded-md`}
          disabled={selectedPriceIndex === null}
        />
      </div>
      <div className="overflow-x-auto pt-4">
        <table className="table">
          <thead>
            <tr className="text-gray text-lg bg-[#F5F2F2] border-none ">
              <th className="text-center">ID#</th>
              <th className="text-center">Price</th>
              <th className="text-center">Status</th>
              <th className="text-center">Transaction Date</th>
              <th className="text-center">Update</th>
            </tr>
          </thead>
          <tbody>
            {!isTableLoading && prices.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-10 font-medium text-gray text-center"
                >
                  No prices has been listed yet
                </td>
              </tr>
            ) : (
              prices.map((price: PricingResponse, index) => (
                <tr
                  className="border-b-2 border-[#F5F2F2] font-medium text-gray"
                  key={index}
                >
                  <td className="text-center">{price.priceId}</td>
                  <td className="text-center">{price.price}</td>
                  <td className="text-center">{price.status}</td>
                  <td className="text-center">{price.date}</td>
                  <td className="text-center">
                    <div className="flex justify-center items-center ">
                      <input
                        type="radio"
                        name="priceSelection"
                        className="custom-checkbox"
                        checked={selectedPriceIndex === index}
                        onChange={() => handleRadioChange(index)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <AddPrice
          isOpen={addPriceOprn}
          onClose={() => setAddPriceOpen(false)}
        />
        <UpdatePrice
          isOpen={UpdatePriceOprn}
          onClose={() => setUpdatePriceOpen(false)}
          priceId={prices[selectedPriceIndex as number]?.priceId}
        />
      </div>
    </div>
  );
};

export default Pricing;
