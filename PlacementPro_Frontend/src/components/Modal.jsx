import React from 'react';
import { X } from 'lucide-react';
import Button from './Button';

// Modal component for displaying dialogs with customizable content and actions
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer = null,
  size = 'md',
  closeButton = true,
}) => {
  if (!isOpen) return null;

  // Define modal sizes
  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-200"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className={`relative bg-white dark:bg-slate-900 rounded-lg shadow-lg ${sizeStyles[size]} w-full mx-4 transition-all duration-200`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
          {closeButton && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 flex justify-end space-x-3 rounded-b-lg">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
