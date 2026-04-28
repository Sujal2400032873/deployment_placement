import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';

const LandingFooter = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h4 className="text-white font-semibold">PlacementPro</h4>
            <p className="text-sm text-gray-400 mt-1">Campus Placement Management System</p>
          </div>

          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>

          <div className="flex items-center gap-3">
            <a href="#" className="text-gray-400 hover:text-white"><Github className="w-5 h-5"/></a>
            <a href="#" className="text-gray-400 hover:text-white"><Linkedin className="w-5 h-5"/></a>
            <a href="#" className="text-gray-400 hover:text-white"><Twitter className="w-5 h-5"/></a>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500">© {new Date().getFullYear()} PlacementPro. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default LandingFooter;
