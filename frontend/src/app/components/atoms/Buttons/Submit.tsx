import React from "react";

interface SubmitProps {
  onClick: () => void;
  label: string;
  className?: string;
  disabled: boolean;
}

const Submit: React.FC<SubmitProps> = ({
  onClick,
  label,
  className = "",
  disabled = false,
}) => {
  return (
    <button
      className={`p-2 w-44 duration-200 font-semibold rounded-md shadow-md ${
        disabled
          ? "bg-white text-primary/60 hover:bg-white hover:text-primary/60 cursor-not-allowed"
          : "bg-primary text-light hover:border-primary hover:text-secondary"
      } ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Submit;
