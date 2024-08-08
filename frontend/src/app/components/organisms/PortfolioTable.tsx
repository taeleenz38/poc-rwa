import React from "react";

type TableProps = {
  headers: string[];
  data: any[];
  renderRow: (item: any, index: number) => React.ReactNode;
  loadingMessage: string;
};

const PortfolioTable: React.FC<TableProps> = ({
  headers,
  data,
  renderRow,
  loadingMessage,
}) => {
  return (
    <div className="overflow-x-auto">
      {data.length === 0 ? (
        <p>{loadingMessage}</p>
      ) : (
        <table className="table w-full">
          <thead className="text-primary bg-[#F5F2F2] border-none">
            <tr className="border-none">
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>{data.map((item, index) => renderRow(item, index))}</tbody>
        </table>
      )}
    </div>
  );
};

export default PortfolioTable;
