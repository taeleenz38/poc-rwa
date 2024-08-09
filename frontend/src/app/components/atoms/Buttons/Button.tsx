import React from "react";

interface ButtonProps {
  text: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  text,
  className = "",
  onClick,
  disabled = false,
}) => {
  return (
    <button
      className={`py-2 px-4 rounded-md duration-150 ${
        disabled ? "text-white bg-gray cursor-not-allowed" : className
      } ${!disabled ? className : ""}`}
      style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.25)" }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
