import React from "react";

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea: React.FC<TextAreaProps> = ({ label, value, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-white">{label}</label>
      <textarea
        className="mt-1 p-2 block w-full bg-gray-800 rounded-md border border-white shadow-sm"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default TextArea;
