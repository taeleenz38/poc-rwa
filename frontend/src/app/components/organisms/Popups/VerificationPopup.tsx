import React, { useState } from "react";
import CloseButton from "../../atoms/Buttons/CloseButton";
import Submit from "../../atoms/Buttons/Submit";
import Button from "../../atoms/Buttons/Button";
import axios from "axios";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

const VerificationPopup = ({
  isOpen,
  onClose,
  id,
  firstName,
  lastName,
  email,
}: Props) => {
  const [status, setStatus] = useState<"Submitted" | "Init" | "Done">(
    "Submitted"
  );
  const [documentStatus, setDocumentStatus] = useState<
    "Submitted" | "Init" | "Done"
  >("Submitted");
  const [isLoading, setIsLoading] = useState(false);
  const [isDocumentSigned, setIsDocumentSigned] = useState(false);

  const getStatus = async () => {
    try {
      setIsLoading(true);
      const statusUrl =
        process.env.NEXT_PUBLIC_BACKEND_API + "/kyc/status/" + id;

      const response = await axios.get(statusUrl);
      if (response.data.reviewStatus === "completed") {
        setStatus("Done");
      } else {
        setStatus("Init");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendSignRequest = async () => {
    const requestData = {
      firstName,
      lastName,
      email,
    };

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_API + "/contract-sign/send",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Sign request sent successfully:", response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error sending sign request:",
          error.response?.data || error.message
        );
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const getDocumentStatus = async (email: string) => {
    try {
      const documentStatusUrl = `${process.env.NEXT_PUBLIC_BACKEND_API}/contract-sign/status?email=${email}`;

      const response = await axios.get(documentStatusUrl);
      if (response.data.status === "SIGN_COMPLETED") {
        setDocumentStatus("Done");
      } else {
        setDocumentStatus("Init");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsDocumentSigned(true);
    }
  };

  const onCloseModal = () => {
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center ">
      <div className="p-6 rounded-lg text-light bg-primary border-2 border-light shadow-md shadow-white w-1/3 transform scale-0 animate-zoomIn duration-1000">
        <div className="flex justify-between items-center mb-8 border-b pb-3">
          <h2 className="text-xl text-white font-bold w-full text-center">
            Verification Has Been Submitted
          </h2>
          <CloseButton onClick={onCloseModal} />
        </div>
        <div className="flex flex-col justify-center items-center gap-4">
          {/* <span>Please </span> */}
          <span>
            {" "}
            {status === "Done"
              ? "You have been verified !"
              : status === "Init"
              ? "Verification is being proccessed. Try Again !"
              : ""}
          </span>
          {status === "Done" ? (
            <>
              <Button
                text={"Send Document To Email"}
                onClick={sendSignRequest}
              />
              <span>
                {isDocumentSigned
                  ? "Documents have been signed!"
                  : "Waiting for document signing to be signed..."}
              </span>
            </>
          ) : (
            <Button
              text={` ${isLoading ? "Checking Status..." : "Get Verified"}`}
              onClick={getStatus}
              className="bg-white text-black"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationPopup;
