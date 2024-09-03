import React from "react";
import { useQuery } from "urql";
import { GET_PRICE_LIST } from "@/lib/urqlQueries";
import { BigNumber, ethers } from "ethers";

type PriceItem = {
  id: string;
  priceId: string;
  price: string;
  date: string;
  status: string;
};

// Function to format large numbers with commas and two decimal places
const formatNumberWithCommas = (number: number | string): string => {
  const num = typeof number === "string" ? parseFloat(number) : number;
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const hexToDecimal = (hex: string): number => {
  return parseInt(hex, 16);
};

// Function to format the price from scientific notation
const formatPrice = (price: string): string => {
  // Convert price to BigNumber
  const bigNumberPrice = BigNumber.from(price);

  // Convert BigNumber to a readable string
  const formattedPrice = ethers.utils.formatUnits(bigNumberPrice, 18); // assuming price is in wei or similar

  // Format price to include commas and two decimal places
  return formatNumberWithCommas(formattedPrice);
};

const PriceList: React.FC = () => {
  const [{ data, fetching, error }] = useQuery({
    query: GET_PRICE_LIST,
  });

  const priceItems: PriceItem[] = data?.priceAddeds || [];

  if (fetching) return <div>Loading...</div>;
  if (error) return <div>Error fetching price list: {error.message}</div>;

  return (
    <div className="w-full h-3/4 p-4 mx-auto text-primary bg-white flex flex-col mt-8 rounded-md bg-right-bottom">
      <div className="text-3xl font-semibold mb-6 text-center mt-4">
        Pricing Overview
      </div>
      <div className="flex flex-col gap-y-3 h-[80vh] overflow-y-scroll rounded-md p-4">
        {priceItems.map((item) => (
          <div key={item.id} className="p-4 rounded-lg bg-primary text-light">
            <div>
              <h3 className="text-lg font-medium mb-2">
                Price ID: {hexToDecimal(item.priceId)}
              </h3>
              <p>
                <strong>Price:</strong> {formatPrice(item.price)} AUDC
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceList;
