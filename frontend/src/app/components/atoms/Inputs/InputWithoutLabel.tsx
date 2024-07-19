import React, { FC } from "react";

interface InputWithoutLabelProps {
  id: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputWithoutLabel: FC<InputWithoutLabelProps> = ({
  id,
  name,
  type,
  placeholder,
  value,
  className,
  onChange,
}) => (
  <input
    type={type}
    id={id}
    name={name}
    className={`mt-1 block w-full px-3 py-2 border border-white rounded-md shadow-sm focus:outline-none focus:ring-[#C8A951] focus:border-[#C8A951] ${className}`}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
  />
);

export default InputWithoutLabel;
