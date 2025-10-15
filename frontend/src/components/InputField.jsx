import React from 'react';

const InputField = ({ label, type = "text", value, onChange, placeholder }) => (
  <div className="mb-4">
    {label && <label className="block text-gray-700 mb-1">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border rounded px-3 py-2 w-full"
    />
  </div>
);

export default InputField;
