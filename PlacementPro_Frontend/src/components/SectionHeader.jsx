import React from 'react';

const SectionHeader = ({ title, subtitle, badge }) => (
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-8">
    <div>
      {badge && <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">{badge}</span>}
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900">{title}</h2>
      {subtitle && <p className="text-gray-600 mt-1 max-w-2xl">{subtitle}</p>}
    </div>
  </div>
);

export default SectionHeader;
