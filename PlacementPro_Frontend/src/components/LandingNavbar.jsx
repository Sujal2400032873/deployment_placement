import React, { useState } from 'react';
import { Users } from 'lucide-react';
import Button from './Button';

const LandingNavbar = ({ onLogin, onSignup }) => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg text-gray-900">PlacementPro</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
            <a href="/" className="hover:text-gray-900">Home</a>
            <a href="/about" className="hover:text-gray-900">About</a>
            <a href="/pricing" className="hover:text-gray-900">Pricing</a>
            <a href="/contact" className="hover:text-gray-900">Contact</a>
            <a href="/jobs" className="hover:text-gray-900">Jobs</a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex gap-3">
              <button onClick={onLogin} className="text-sm text-gray-700 hover:text-gray-900">Login</button>
              <Button size="sm" onClick={onSignup}>Sign Up</Button>
            </div>

            <button className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100" onClick={() => setOpen(!open)} aria-label="menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open?"M6 18L18 6M6 6l12 12":"M4 6h16M4 12h16M4 18h16"} /></svg>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 flex flex-col gap-2">
            <a href="#features" className="py-2">Features</a>
            <a href="#pricing" className="py-2">Pricing</a>
            <a href="#about" className="py-2">About</a>
            <a href="#contact" className="py-2">Contact</a>
            <div className="pt-2 flex gap-2">
              <button onClick={onLogin} className="flex-1 py-2 text-center text-sm">Login</button>
              <Button size="sm" onClick={onSignup} className="flex-1">Sign Up</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNavbar;
