import React, { FC } from "react";

interface InputWithLabelProps {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  widthfull?: boolean;
}

const InputWithLabel: FC<InputWithLabelProps> = ({
  id,
  name,
  type,
  label,
  placeholder,
  value,
  onChange,
  widthfull,
}) => (
  <div className={`flex ${widthfull ? "w-full" : "w-2/3"} items-center mb-5`}>
    <label htmlFor={id} className="w-48 font-semibold">
      {label}:
    </label>
    <input
      type={type}
      id={id}
      name={name}
      className="mt-1 block w-full px-3 py-2 border font-semibold border-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

export default InputWithLabel;
