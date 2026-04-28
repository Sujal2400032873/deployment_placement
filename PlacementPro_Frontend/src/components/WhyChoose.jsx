import React from 'react';
import { Award, CheckCircle, Zap } from 'lucide-react';

const WhyChoose = () => {
  return (
    <section id="why" className="py-16 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Why Choose PlacementPro</h2>
          <p className="text-gray-600 mt-2">A modern placement platform built for speed, security and results.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-50 rounded-md"><Award className="w-5 h-5 text-blue-600" /></div>
              <h3 className="font-semibold">Premium Experience</h3>
            </div>
            <p className="text-sm text-gray-600">Polished UI and workflows that reduce admin time and increase student engagement.</p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-50 rounded-md"><CheckCircle className="w-5 h-5 text-blue-600" /></div>
              <h3 className="font-semibold">Reliable & Secure</h3>
            </div>
            <p className="text-sm text-gray-600">Role-based access, encrypted data storage and audit-friendly workflows.</p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-50 rounded-md"><Zap className="w-5 h-5 text-blue-600" /></div>
              <h3 className="font-semibold">Fast Setup</h3>
            </div>
            <p className="text-sm text-gray-600">Quick onboarding with intuitive controls and powerful integrations.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
