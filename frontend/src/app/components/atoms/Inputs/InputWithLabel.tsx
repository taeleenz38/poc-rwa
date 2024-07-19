import React, { FC } from "react";

interface InputWithLabelProps {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputWithLabel: FC<InputWithLabelProps> = ({
  id,
  name,
  type,
  label,
  placeholder,
  value,
  onChange,
}) => (
  <div className="flex w-2/3 items-center mb-5">
    <label htmlFor={id} className="w-48 font-medium">
      {label}:
    </label>
    <input
      type={type}
      id={id}
      name={name}
      className="mt-1 block w-full px-3 py-2 border border-white rounded-md shadow-sm focus:outline-none focus:ring-[#C8A951] focus:border-[#C8A951]"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

export default InputWithLabel;
