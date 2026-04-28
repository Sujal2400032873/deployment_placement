import React from 'react';

const Loader = ({ size = 'md', label = 'Loading...', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-5 h-5 border-2',
    lg: 'w-7 h-7 border-4',
  }; 
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizeClasses[size]} border-current border-t-transparent rounded-full animate-spin`} />
      {label && <span className="text-sm text-gray-600">{label}</span>}
    </div>
  );
};

export default Loader;
