import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

// Toast notification component for displaying temporary messages
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    // Auto-close after 3 seconds
    const timer = setTimeout(() => {
      onClose?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const IconComponent = type === 'error' ? AlertCircle : CheckCircle;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-200">
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg border ${typeStyles[type]} shadow-lg`}>
        <IconComponent className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
};

export default Toast;
