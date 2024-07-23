import React from "react";

interface ButtonProps {
  text: string;
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, className, onClick }) => {
  return (
    <button
      className={`border-2 py-2 px-4 rounded-lg ${className} duration-200`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
