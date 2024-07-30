import React from "react";
import CloseButton from "../../atoms/Buttons/CloseButton";
import Submit from "../../atoms/Buttons/Submit";
import Button from "../../atoms/Buttons/Button";

type Props = { isOpen: boolean; onClose: () => void };

const VerificationPopup = ({ isOpen, onClose }: Props) => {
  const onCloseModal = () => {
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="p-6 rounded-lg text-light bg-primary border-2 border-light shadow-md shadow-white w-1/3">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl text-light font-bold">
            Verification Has Been Processed
          </h2>
          <CloseButton onClick={onCloseModal} />
        </div>
        <div className="flex justify-center items-center gap-4">
          <span> Please sign the documentation</span>
          <Button text={"Sign Documenttion"} onClick={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default VerificationPopup;
