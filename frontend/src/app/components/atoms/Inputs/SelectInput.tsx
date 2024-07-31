import React from "react";

interface SelectFieldProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string | number }[];
  className?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  className = "",
}) => {
  return (
    <div className={`flex items-center w-full mb-5 ${className}`}>
      <label className="block font-semibold w-48">{label}</label>
      <select
        className="border-1 p-2 rounded-lg bg-gray shadow-sm w-full focus:outline-none focus:ring-1 focus:ring-primary text-primary"
        value={value.toString()}
        onChange={onChange}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
