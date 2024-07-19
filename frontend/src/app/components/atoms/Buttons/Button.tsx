import React from "react";

interface ButtonProps {
  text: string;
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, className, onClick }) => {
  return (
    <button
      className={`border-2 p-3 rounded-lg hover:bg-white hover:text-black ${className} duration-200`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
