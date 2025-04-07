import React, { useState, ChangeEvent } from "react";
import Button from "../atoms/Buttons/Button";
import FileUpload from "@/app/components/organisms/Popups/FileUpload";

const AEMFPricing: React.FC = () => {
  const [uploadFileOpen, setUploadFileOpen] = useState(false);

  return (
    <div className="flex flex-col w-full p-4">
      <div className="flex w-full justify-around items-center py-6">
        <Button
          text={"Upload New Balance Sheet"}
          onClick={() => setUploadFileOpen(true)}
          className="bg-primary py-2 text-light hover:bg-secondary-focus"
        />
        <FileUpload
          isOpen={uploadFileOpen}
          onClose={() => setUploadFileOpen(false)}
        />
      </div>
      <div className="overflow-x-auto pt-4">
        <table className="table">
          <thead>
            <tr className="text-secondary text-sm font-semibold bg-[#F5F2F2] border-none">
              <th className="text-center">ID</th>
              <th className="text-center">Document Name</th>
              <th className="text-center">Net Asset Value</th>
              <th className="text-center">Upload Date</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
};

export default AEMFPricing;
