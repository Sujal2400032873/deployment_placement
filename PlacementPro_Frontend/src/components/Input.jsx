import React from 'react';

// Reusable input component with label, error handling, and multiple input types
const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error = '',
  required = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />}
        <input
          type={type}
          placeholder={placeholder}
          value={value ?? ''}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-gray-100 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:focus:ring-orange-500
            disabled:bg-gray-100 dark:disabled:bg-slate-800 disabled:text-gray-500 dark:disabled:text-slate-500
            transition-all duration-200
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
