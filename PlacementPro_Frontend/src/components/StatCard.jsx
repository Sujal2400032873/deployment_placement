import React from 'react';

const StatCard = ({ value, label, icon }) => {
  return (
    <div className="rounded-2xl bg-white/45 dark:bg-slate-800/50 backdrop-blur-md border border-white/30 dark:border-slate-700/50 p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        {icon && <div className="text-orange-600 dark:text-orange-400">{icon}</div>}
        <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-black dark:from-orange-400 dark:to-white">{value}</p>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{label}</p>
    </div>
  );
};

export default StatCard;
