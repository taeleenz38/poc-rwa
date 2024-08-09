import React from "react";

interface TextFieldProps {
  label: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  value,
  onChange,
  type = "text",
  className = "",
}) => {
  return (
    <div className={`flex items-center w-full mb-5 `}>
      <label className="block font-bold w-1/4 mr-4">{label}</label>
      <input
        type={type}
        className="mt-1 text-black bg-slate-800 block w-full px-3 py-2 border border-light rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default TextField;
