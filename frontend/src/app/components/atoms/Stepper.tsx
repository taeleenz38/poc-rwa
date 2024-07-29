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
  return (
    <div className="flex flex-col justify-center">
      {Array.from({ length: totalSteps }, (_, index) => (
        <div key={index} className="flex mb-6 items-center">
          <div
            className={`w-4 h-4 rounded-full ${
              index < currentStep ? "bg-secondary" : "bg-white"
            }`}
          ></div>
          <span className="ml-2 text-white">{stepLabels[index]}</span>
        </div>
      ))}
    </div>
  );
};

export default Stepper;
