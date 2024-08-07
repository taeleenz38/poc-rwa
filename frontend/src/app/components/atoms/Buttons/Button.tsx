import React from "react";

interface ButtonProps {
  text: string;
  className?: string;
  onClick?: () => void;

  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  text,
  className,
  onClick,

  disabled,
}) => {
  return (
    <button
      className={`py-2 px-4 ${className} duration-150`}
      style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.25)" }}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
