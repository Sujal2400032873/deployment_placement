import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ options = [], selected, onSelect, placeholder = 'Select', label, className = '' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const selectedItem = options.find((o) => o.value === selected);

  return (
    <div className={`relative ${className}`} ref={ref}>
      {label && <span className="block text-sm font-medium text-gray-700 mb-2">{label}</span>}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="w-full text-left px-4 py-2 border rounded-lg bg-white flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="truncate text-gray-700">{selectedItem?.label || placeholder}</span>
        <span className="text-gray-500">▾</span>
      </button>

      {open && (
        <div className="absolute z-40 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onSelect(option.value);
                setOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm ${selected === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
