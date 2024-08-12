import React from "react";

type StepperProps = {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
};

const Stepper: React.FC<StepperProps> = ({
  currentStep,
  totalSteps,
  stepLabels,
}) => {
  console.log(stepLabels);
  return (
    <div className="flex flex-col justify-center ">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="flex mb-2 items-center">
          <div
            className={`w-10 h-10 rounded-full border  border-secondary  outline-2 outline-white ${
              (currentStep >= 4 && index <= 1) ||
              (currentStep >= 5 && index <= 2) ||
              (currentStep >= 6 && index <= 3) ||
              (currentStep < 4 && index === 0)
                ? "bg-primary/70"
                : "bg-white"
            }`}
            style={{ borderWidth: "8px" }}
          ></div>
          <span className="ml-2 text-primary">{stepLabels[index]}</span>
        </div>
      ))}
    </div>
  );
};

export default Stepper;
