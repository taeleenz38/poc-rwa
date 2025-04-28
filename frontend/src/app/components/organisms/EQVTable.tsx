import React, { useEffect, useState } from "react";

interface Document {
  id: number;
  actualFileName: string;
  NavValue: number;
  createDate: string;
}

const ITEMS_PER_PAGE = 6;

const EQVTable = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(documents.length / ITEMS_PER_PAGE);

  const paginatedDocuments = documents.slice(
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

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow" as RequestRedirect,
    };

    fetch(
      `${process.env.NEXT_PUBLIC_FILE_API}/file-upload/list`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("Fetched data:", result);
        setDocuments(result.data || []);
      })
      .catch((error) => console.error("Error fetching document list:", error));
  }, []);

  return (
    <>
      <table className="table">
        <thead>
          <tr className="text-secondary text-sm font-semibold bg-[#F5F2F2] border-none">
            <th className="text-center w-1/4 rounded-tl-xl">ID</th>
            <th className="text-center w-1/4">Document Name</th>
            <th className="text-center w-1/4">Net Asset Value</th>
            <th className="text-center w-1/4 rounded-tr-xl">Upload Date</th>
          </tr>
        </thead>
        <tbody>
          {paginatedDocuments.map((doc) => (
            <tr
              className="border-b-2 border-[#F5F2F2] text-center text-sm text-secondary"
              key={doc.id}
            >
              <td className="py-6">{doc.id}</td>
              <td className="py-6">{doc.actualFileName}</td>
              <td className="py-6">
                {Number(doc.NavValue).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </td>
              <td className="py-6">
                {new Date(doc.createDate).toLocaleDateString()}
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

export default EQVTable;
