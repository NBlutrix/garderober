import React from 'react';

const Input = ({ label, type = 'text', value, onChange, placeholder }) => (
    <div className="mb-4">
        {label && <label className="block mb-1 font-semibold">{label}</label>}
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    </div>
);

export default Input;
