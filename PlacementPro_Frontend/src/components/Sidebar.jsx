import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ navigation = [], isOpen, onClose }) => {
  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-xl border-r border-gray-200 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="h-full flex flex-col">
        <div className="px-4 py-4 font-bold text-blue-700 border-b border-gray-200">Navigation</div>
        <div className="p-4 flex-1 space-y-2">
          {navigation.map((item) => (
            <Link key={item.path} to={item.path} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50" onClick={onClose}>
              {item.label}
            </Link>
          ))}
        </div>
        <button onClick={onClose} className="m-4 px-3 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">Close</button>
      </div>
    </aside>
  );
};

export default Sidebar;
