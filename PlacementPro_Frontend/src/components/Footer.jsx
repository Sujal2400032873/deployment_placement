import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 mt-8">
      <div className="max-w-7xl mx-auto px-5 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="font-semibold text-gray-100 mb-2">PlacementPro © {new Date().getFullYear()}</p>
            <p className="text-gray-400 text-sm">Modern campus placement platform for students, employers, and placement officers.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-100 mb-2">Quick Links</h3>
            <ul className="grid grid-cols-2 gap-2 text-gray-300 text-sm font-bold">
              <li><Link to="/" className="hover:text-orange-500 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-orange-500 transition-colors">About</Link></li>
              <li><Link to="/pricing" className="hover:text-orange-500 transition-colors">Pricing</Link></li>
              <li><Link to="/contact" className="hover:text-orange-500 transition-colors">Contact</Link></li>
              <li><Link to="/login" className="hover:text-orange-500 transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-orange-500 transition-colors">Register</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
