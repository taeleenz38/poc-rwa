import React, { useEffect, useState } from "react";

interface VLRDocument {
  id: number;
  totalDailyLiquidAssets: string;
  totalWeeklyLiquidAssets: string;
  percentageDailyLiquidAssets: string;
  percentageWeeklyLiquidAssets: string;
  totalAssetsValue: string;
  date: string;
}

const ITEMS_PER_PAGE = 6;

const VLRTable = () => {
  const [documents, setDocuments] = useState<VLRDocument[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(documents.length / ITEMS_PER_PAGE);

  const paginatedDocuments = documents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePreviousPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow" as RequestRedirect,
    };

    fetch(
      "https://dev.tokenisation.gcp-hub.com.au/upload-backend/liquid-assets/list?skip=0&take=100",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("Fetched VLR data:", result);
        setDocuments(result.data || []);
      })
      .catch((error) => console.error("Error fetching VLR list:", error));
  }, []);

  return (
    <>
      <table className="table">
        <thead>
          <tr className="text-secondary text-sm font-semibold bg-[#F5F2F2] border-none">
            <th className="text-center w-1/6 rounded-tl-xl">
              Daily Liquid Assets
            </th>
            <th className="text-center w-1/6">Weekly Liquid Assets</th>
            <th className="text-center w-1/6">Total Assets</th>
            <th className="text-center w-1/6">% Daily</th>
            <th className="text-center w-1/6">% Weekly</th>
            <th className="text-center w-1/6 rounded-tr-xl">Date</th>
          </tr>
        </thead>
        <tbody>
          {paginatedDocuments.map((doc) => (
            <tr
              className="border-b-2 border-[#F5F2F2] text-center text-sm text-secondary"
              key={doc.id}
            >
              <td className="py-6">
                {Number(doc.totalAssetsValue).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </td>
              <td className="py-6">
                {Number(doc.totalDailyLiquidAssets).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </td>
              <td className="py-6">
                {Number(doc.totalWeeklyLiquidAssets).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </td>{" "}
              <td className="py-6">{doc.percentageDailyLiquidAssets}%</td>
              <td className="py-6">{doc.percentageWeeklyLiquidAssets}%</td>
              <td className="py-6">
                {new Date(doc.date).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex w-1/3 mx-auto justify-between items-center mt-8">
        <button
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === 1
              ? "bg-light text-secondary cursor-not-allowed"
              : "bg-primary text-white hover:bg-secondary-focus"
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
              : "bg-primary text-white hover:bg-secondary-focus"
          }`}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default VLRTable;
