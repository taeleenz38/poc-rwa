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
      <label className="block font-bold w-1/4 mr-4">{label}</label>
      <select
        className="border-2 p-2 rounded-lg w-3/4 focus:outline-none focus:ring-2 focus:ring-[#C8A951] text-light"
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
