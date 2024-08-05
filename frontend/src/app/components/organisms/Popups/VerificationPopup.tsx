import axios from "axios";
import HelloSign from "hellosign-embedded";
import { useState } from "react";
import Button from "../../atoms/Buttons/Button";
import CloseButton from "../../atoms/Buttons/CloseButton";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

const dropBoxSignclient = new HelloSign({
  clientId: process.env.NEXT_PUBLIC_DROPBOX_SIGN_CLIENT_ID,
});

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
        process.env.NEXT_PUBLIC_BACKEND_API + "/contract-sign-embd/sign",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Sign request sent successfully:", response.data);

      if (response.data.signUrl) {
        dropBoxSignclient.open(response.data.signUrl, {
          skipDomainVerification: true,
        });
      }
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
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="p-6 rounded-lg text-light bg-primary border-2 border-light shadow-md shadow-white w-2/5">
        <div className="flex justify-between items-center mb-8 w-full relative">
          <h2 className="text-3xl text-white font-bold flex-grow text-center">
            Verification
          </h2>
          <div className="absolute right-0">
            <CloseButton onClick={onCloseModal} />
          </div>
        </div>
        <div className="flex flex-col text-center px-8 text-xl mb-4 font-medium gap-5">
          {/* <span>Please </span> */}
          <span>
            {" "}
            {status === "Done"
              ? "You have been verified !"
              : status === "Init"
              ? "Verification is being proccessed. Try Again !"
              : isDocumentSigned
              ? ""
              : ""}
          </span>
          {status === "Done" ? (
            <div className="w-full flex items-center justify-center">
              <Button
                text={"Sign Document"}
                onClick={sendSignRequest}
                className="!bg-[#e6e6e6] !text-primary hover:!text-secondary w-fit items-center justify-center"
              />
              {/* <span>
                {isDocumentSigned
                  ? "Documents have been signed!"
                  : "Waiting for document signing to be signed..."}
              </span> */}
            </div>
          ) : (
            <div className="w-full flex items-center justify-center">
              <Button
                text={` ${isLoading ? "Checking Status..." : "Check Status"}`}
                onClick={getStatus}
                className="!bg-[#e6e6e6] !text-primary hover:!text-secondary w-fit items-center"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationPopup;
