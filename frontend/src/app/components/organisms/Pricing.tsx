import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "../atoms/Buttons/Button";
import AddPrice from "./Popups/SetPrice";
import UpdatePrice from "./Popups/UpdatePrice";

interface PricingResponse {
  priceId: string;
  price: string;
  status: string;
  date: string;
}

const ITEMS_PER_PAGE = 6;

const Pricing = () => {
  const [prices, setPrices] = useState<PricingResponse[]>([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [addPriceOprn, setAddPriceOpen] = useState(false);
  const [updatePriceOprn, setUpdatePriceOpen] = useState(false);
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleRadioChange = (priceId: string) => {
    if (priceId === selectedPriceId) {
      setSelectedPriceId(null);
    } else {
      setSelectedPriceId(priceId);
    }
  };

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setIsTableLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/price-list`
        );

        const sortedPrices = response.data.sort(
          (a: PricingResponse, b: PricingResponse) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          }
        );

        setPrices(sortedPrices);
      } catch (error) {
        console.error("Error fetching prices:", error);
      } finally {
        setIsTableLoading(false);
      }
    };

    fetchPrices();
  }, []);

  const totalPages = Math.ceil(prices.length / ITEMS_PER_PAGE);

  const paginatedPrices = prices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isTableLoading) {
    return (
      <div className="flex justify-center items-center flex-col w-full p-4">
        <div className="text-base">Pricing Data Loading....</div>
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
            selectedPriceId === null
              ? `bg-gray/20 text-primary`
              : "bg-primary text-light hover:bg-light hover:text-primary"
          } py-2 rounded-md`}
          disabled={selectedPriceId === null}
        />
      </div>
      <div className="overflow-x-auto pt-4">
        <table className="table">
          <thead>
            <tr className="text-gray text-sm font-semibold bg-[#F5F2F2] border-none">
              <th className="text-center">ID</th>
              <th className="text-center">Price</th>
              <th className="text-center">Status</th>
              <th className="text-center">Transaction Date</th>
              <th className="text-center">Update</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPrices.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-10 font-medium text-gray text-center"
                >
                  No prices have been listed yet
                </td>
              </tr>
            ) : (
              paginatedPrices.map((price: PricingResponse) => (
                <tr
                  className="border-b-2 border-[#F5F2F2] text-sm text-gray"
                  key={price.priceId}
                >
                  <td className="text-center">{price.priceId}</td>
                  <td className="text-center">${price.price}</td>
                  <td className="text-center">{price.status}</td>
                  <td className="text-center">{price.date}</td>
                  <td className="text-center">
                    <div className="flex justify-center items-center ">
                      <input
                        type="radio"
                        name="priceSelection"
                        className="custom-checkbox"
                        checked={selectedPriceId === price.priceId}
                        onChange={() => handleRadioChange(price.priceId)}
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
          isOpen={updatePriceOprn}
          onClose={() => setUpdatePriceOpen(false)}
          priceId={selectedPriceId || ""}
        />
      </div>

      <div className="flex w-1/3 mx-auto justify-between items-center mt-8">
        <button
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-light text-primary"
          }`}
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <div>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === index + 1
                  ? "bg-primary text-light"
                  : "bg-light text-primary"
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-light text-primary"
          }`}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pricing;
