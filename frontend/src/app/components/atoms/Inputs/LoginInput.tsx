import React from "react";

interface LoginInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LoginInput: React.FC<LoginInputProps> = ({
  id,
  label,
  type,
  value,
  onChange,
}) => (
  <div className="mb-3">
    <label htmlFor={id} className="block text-sm font-medium text-dark dark:text-light">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      className="border border-gray-300 rounded-md w-full py-2 px-3"
      value={value}
      onChange={onChange}
      required
    />
  </div>
);

export default LoginInput;
