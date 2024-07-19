import React, { FC } from "react";

interface SignUpNavButtonProps {
  onClick: () => void;
  label: string;
}

const SignUpNavButton: FC<SignUpNavButtonProps> = ({ onClick, label }) => (
  <button
    className="font-bold hover:text-[#C8A951] hover:cursor-pointer duration-200"
    onClick={onClick}
    aria-label={label}
  >
    {label}
  </button>
);

export default SignUpNavButton;
