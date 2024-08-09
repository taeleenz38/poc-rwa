import React, { FC } from "react";
import TextField from "./TextInput";

interface InputWithLabelProps {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  widthfull?: boolean;
  border?: boolean;
  required?: boolean;
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
  border,
  required = false,
}) => (
  <div className="relative flex w-1/2 items-center mb-5 border border-gray/70 rounded-md">
    <label
      htmlFor={id}
      className="absolute -top-3 left-2 bg-white px-1 text-sm text-gray/50"
    >
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      className="p-3 block w-full px-2 text-xs rounded-md  focus:outline-none focus:ring-0 focus:border-blue-500 text-gray/90"
      // placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required} // Uncomment if required
      // disabled={disabled}
    />
  </div>
);

export default InputWithLabel;
