import React, { useState } from "react";

interface FileUploadProps {
  label: string;
  onChange: (file: File | null) => void;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  onChange,
  className = "",
}) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileName(file ? file.name : null);
    onChange(file);
  };

  return (
    <div className={`flex flex-col items-start ${className}`}>
      <label className="block font-bold mb-2">{label}</label>
      <input
        type="file"
        onChange={handleFileChange}
        className="p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
};

export default FileUpload;
