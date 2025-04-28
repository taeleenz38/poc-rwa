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
      className={`py-2 px-4 rounded-xl ${className} duration-150`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
