import React from "react";

interface DateInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const DateInput: React.FC<DateInputProps> = ({
  label,
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className={`flex items-center w-full mb-5 ${className}`}>
      <label className="block font-bold w-1/4 mr-4">{label}</label>
      <input
        type="date"
        className="border-2 p-2 rounded-lg w-3/4 focus:outline-none focus:ring-2 focus:ring-[#C8A951] text-light"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default DateInput;
