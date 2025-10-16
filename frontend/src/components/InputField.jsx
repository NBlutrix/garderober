import React from 'react';

const InputField = ({ label, type = 'text', value, onChange, placeholder }) => {
  return (
    <div className="flex flex-col">
      {label && <label className="mb-1 font-medium text-gray-700">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
};

export default InputField;
