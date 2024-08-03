import React from "react";

interface CloseButtonProps {
  onClick: () => void;
  className?: string;
}

const CloseButton: React.FC<CloseButtonProps> = ({
  onClick,
  className = "",
}) => {
  return (
    <button onClick={onClick} className={`text-3xl font-bold ${className}`}>
      &times;
    </button>
  );
};

export default CloseButton;
