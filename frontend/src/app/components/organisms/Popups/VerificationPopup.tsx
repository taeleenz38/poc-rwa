import React, { useState } from "react";
import CloseButton from "../../atoms/Buttons/CloseButton";
import Submit from "../../atoms/Buttons/Submit";
import Button from "../../atoms/Buttons/Button";
import axios from "axios";

type Props = { isOpen: boolean; onClose: () => void; id: string };

const VerificationPopup = ({ isOpen, onClose, id }: Props) => {
  const [status, setStatus] = useState<"Submitted" | "Init" | "Done">(
    "Submitted"
  );
  const [isLoading, setIsLoading] = useState(false);
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

  const onCloseModal = () => {
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="p-6 rounded-lg text-light bg-primary border-2 border-light shadow-md shadow-white w-1/3">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl text-light font-bold">
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
              ? "Verification is been proccessed. Try Again !"
              : ""}
          </span>
          {status === "Done" ? (
            <Button text={"Sign Documents"} onClick={() => {}} />
          ) : (
            <Button
              text={` ${isLoading ? "Checking Status..." : "Get Verified"}`}
              onClick={getStatus}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationPopup;
