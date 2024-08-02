import React, { useEffect, useState } from "react";
import Button from "@/app/components/atoms/Buttons/Button";

// Define the type for the price item
type PriceItem = {
  priceId: string;
  price: string;
};

const PriceList = () => {
  const [priceItems, setPriceItems] = useState<PriceItem[]>([]);

  useEffect(() => {
    const fetchPriceList = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/price-list`
        );
        const data = await response.json();
        setPriceItems(data);
      } catch (error) {
        console.error("Error fetching price list:", error);
      }
    };

    fetchPriceList();
  }, []);

  return (
    <div className="w-full h-3/4 p-4 mx-auto text-primary bg-white  flex flex-col mt-8 rounded-md">
      <div className="text-3xl font-semibold mb-6 text-center mt-4">
        Pricing Overview
      </div>
      <div className="flex flex-col gap-y-2 h-[80vh] overflow-y-scroll border border-gray rounded-md p-4">
        {priceItems.map((item) => (
          <div key={item.priceId} className="p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-2">
              Price ID: {item.priceId}
            </h3>
            <p>
              <strong>Price:</strong> {item.price} AUDC
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceList;
