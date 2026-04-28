import React from 'react';

// Reusable button component with multiple variants and sizes
const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
  loading = false,
  ...props
}) => {
  // Define button styles based on variant
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2';

  const variantStyles = {
    primary: 'bg-gradient-to-r from-orange-500 to-black hover:from-orange-600 hover:to-slate-900 text-white shadow-md hover:shadow-lg hover:shadow-orange-500/20 transform hover:-translate-y-0.5 transition-all duration-300 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-slate-700 dark:disabled:to-slate-800 disabled:transform-none disabled:shadow-none',
    secondary: 'bg-white/50 dark:bg-slate-800/80 backdrop-blur-md border border-gray-200 dark:border-slate-600 text-gray-900 hover:bg-white disabled:bg-gray-300 dark:text-gray-100 dark:hover:bg-slate-700 dark:disabled:bg-slate-800 shadow-sm transition-colors',
    gradient: 'bg-gradient-to-r from-orange-500 to-slate-900 hover:from-orange-600 hover:to-black text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 dark:disabled:bg-slate-700',
    success: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-slate-700',
    outline: 'border-2 border-orange-500 text-orange-600 hover:bg-orange-50 disabled:border-gray-400 disabled:text-gray-400 dark:border-orange-500 dark:text-orange-500 dark:hover:bg-slate-800 dark:disabled:border-slate-600 dark:disabled:text-slate-600'
  };

  const sizeStyles = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    fullWidth: 'w-full px-4 py-2 text-base'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
