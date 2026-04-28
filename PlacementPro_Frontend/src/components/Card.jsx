import React from 'react';

// Reusable card component for displaying content with optional header and footer
const Card = ({
  children,
  header,
  footer,
  className = '',
  hoverable = false,
  onClick = null,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white/45 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-xl rounded-3xl
        transition-all duration-300 overflow-hidden
        ${hoverable ? 'hover:shadow-2xl hover:-translate-y-1 cursor-pointer hover:border-orange-300 dark:hover:border-orange-500/50' : ''}
        ${className}
      `}
    >
      {header && (
        <div className="px-6 py-5 border-b border-gray-200/50 dark:border-slate-700/50 bg-white/30 dark:bg-slate-800/40">
          {header}
        </div>
      )}

      <div className="px-6 py-6">
        {children}
      </div>

      {footer && (
        <div className="px-6 py-5 border-t border-gray-200/50 dark:border-slate-700/50 bg-white/30 dark:bg-slate-800/40">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
