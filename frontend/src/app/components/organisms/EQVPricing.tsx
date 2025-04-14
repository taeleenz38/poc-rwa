import React, { useState, ChangeEvent } from "react";
import Button from "../atoms/Buttons/Button";
import FileUpload from "@/app/components/organisms/Popups/FileUpload";
import UpdatePrice from "./Popups/SetPriceEQV";
import EQVTable from "./EQVTable";

const EQVPricing: React.FC = () => {
  const [uploadFileOpen, setUploadFileOpen] = useState(false);
  const [updatePriceOpen, setUpdatePriceOpen] = useState(false);

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
        <EQVTable />
      </div>
    </div>
  );
};

export default EQVPricing;
