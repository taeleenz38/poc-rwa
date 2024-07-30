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
      className={`border-2 py-2 px-4 rounded-lg ${className} duration-200`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
