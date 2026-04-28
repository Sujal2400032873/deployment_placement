import React from 'react';

const variantStyles = {
  primary: 'bg-blue-100 text-blue-700',
  secondary: 'bg-gray-100 text-gray-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-sky-100 text-sky-700',
};

const Badge = ({ label, variant = 'primary', className = '', icon }) => {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${variantStyles[variant] || variantStyles.primary} ${className}`}>
      {icon && <span className="w-3 h-3">{React.createElement(icon)}</span>}
      {label}
    </span>
  );
};

export default Badge;
