import React from 'react';

const Button = ({ children, onClick, type = 'button', disabled = false, fullWidth = false, className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${fullWidth ? 'w-full' : ''}
        bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition
        disabled:bg-gray-400 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
