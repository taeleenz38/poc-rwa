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
      className={`p-2 w-44 duration-200 font-semibold ${
        disabled
          ? "bg-gray-400 text-gray-200 cursor-not-allowed border-gray-400"
          : "bg-secondary text-light hover:border-secondary hover:bg-light hover:text-secondary"
      } ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Submit;
