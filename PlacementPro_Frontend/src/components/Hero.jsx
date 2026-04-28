import React from 'react';
import Button from './Button';

const Hero = ({ onGetStarted }) => {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="pt-6 lg:pt-0">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
              Streamline Your Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Placements</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-xl">
              PlacementPro connects students, recruiters and placement officers with seamless job posting, resume tracking and analytics — all in one polished platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={onGetStarted} className="shadow-xl">Get Started</Button>
              <Button size="lg" variant="outline">Learn More</Button>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl bg-white/30 backdrop-blur-md">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
                alt="students and recruiters"
                className="w-full h-72 object-cover brightness-95"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">Trusted by colleges & recruiters</h3>
                <p className="text-sm text-gray-600 mt-2">Manage hires, track applications, and get placement analytics in one place.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
