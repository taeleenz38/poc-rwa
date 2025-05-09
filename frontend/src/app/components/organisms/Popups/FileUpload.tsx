import React, { useState, ChangeEvent } from "react";
import CloseButton from "@/app/components/atoms/Buttons/CloseButton";
import Submit from "@/app/components/atoms/Buttons/Submit";

interface FileUploadProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SignedUrlResponse {
  url: string;
  attachmentId: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ isOpen, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadUrl, setUploadUrl] = useState<string>("");
  const [attachmentId, setAttachmentId] = useState<number>(0);

  const onCloseModal = () => {
    onClose();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const getSignedUrl = async (
    fileName: string
  ): Promise<SignedUrlResponse | null> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FILE_API}/file-upload/generate-signed-url/${fileName}`
      );
      const data: SignedUrlResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching signed URL", error);
      return null;
    }
  };

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    setIsUploading(true);

    try {
      const signedData = await getSignedUrl(file.name);

      if (!signedData || !signedData.url || !signedData.attachmentId) {
        alert("Failed to get a valid signed URL or attachment ID.");
        return;
      }

      const { url: signedUrl, attachmentId } = signedData;

      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        alert("Failed to upload file.");
        console.error("Upload failed:", await uploadResponse.text());
        return;
      }

      alert("File uploaded successfully!");

      const formdata = new FormData();
      formdata.append("attachmentId", attachmentId.toString());
      formdata.append("fileStream", file, file.name);

      const postUrl = `${process.env.NEXT_PUBLIC_FILE_API}/file-upload/upload-xls-file`;
      const postResponse = await fetch(postUrl, {
        method: "POST",
        body: formdata,
        redirect: "follow",
      });

      if (!postResponse.ok) {
        alert("Failed to upload the file for processing.");
        console.error("POST request failed:", await postResponse.text());
        return;
      }

      const result = await postResponse.text();
      console.log("POST request succeeded:", result);
      setFile(null);
      onCloseModal();
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="p-6 rounded-lg text-gray bg-white shadow-md w-1/3">
        <div className="flex justify-between items-center mb-8">
          <div></div>
          <h2 className="text-2xl font-bold text-primary">File Upload</h2>
          <CloseButton onClick={onCloseModal} />
        </div>
        <div className="text-center px-8 mb-4">
          Please select the file you wish to upload.
        </div>
        <div className="mb-6 text-center">
          <input
            type="file"
            onChange={handleFileChange}
            className="block mx-auto"
          />
        </div>
        <div className="w-full flex justify-between">
          <div className="w-[49%]">
            <Submit
              onClick={onCloseModal}
              label="Go Back"
              disabled={isLoading || isUploading}
              className="w-full !bg-[#e6e6e6] !text-primary hover:!text-secondary"
            />
          </div>
          <div className="w-[49%]">
            <Submit
              onClick={uploadFile}
              label={isUploading ? "Uploading..." : "Upload File"}
              disabled={isUploading || isLoading}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
