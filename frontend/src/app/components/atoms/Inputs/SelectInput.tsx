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
    <div className="relative flex w-1/2 items-center mb-5 border border-gray/70 rounded-md">
      <label
        htmlFor={label}
        className="absolute -top-3 left-2 bg-white px-1 text-sm text-gray/50"
      >
        {label}
      </label>
      <select
        className="p-3 block w-full mr-1 text-xs rounded-md  focus:outline-none focus:ring-0 focus:border-blue-500 text-gray/90"
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
