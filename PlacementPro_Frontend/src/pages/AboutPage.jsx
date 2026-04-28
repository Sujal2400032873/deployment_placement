import React, { useState } from 'react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import SectionHeader from '../components/SectionHeader';
import Sidebar from '../components/Sidebar';

const AboutPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden transition-colors duration-200">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navigation={[
          { label: 'Home', path: '/' },
          { label: 'About', path: '/about' },
          { label: 'Pricing', path: '/pricing' },
          { label: 'Contact', path: '/contact' },
        ]}
      />

      {/* Modern Aurora UI Mesh Gradient Background */}
      <div className="absolute top-[-5%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-orange-400/20 dark:bg-orange-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-[20%] right-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-slate-400/20 dark:bg-slate-600/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '12s' }}></div>
      <div className="absolute top-[30%] left-[30%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-yellow-400/10 dark:bg-orange-800/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '10s' }}></div>

      <div className="relative z-10 py-12">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/45 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-slate-700/50 text-gray-800 dark:text-gray-200 text-sm shadow hover:shadow-md transition-all font-medium"
          >
            Open Quick Menu
          </button>

          <SectionHeader
            badge="Our Story"
            title="About PlacementPro"
            subtitle="We make campus recruitment professional, transparent and efficient across all stakeholders."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Card className="bg-white/45 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 p-8 rounded-3xl shadow-xl hover:-translate-y-1 transition-transform duration-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><span className="w-1.5 h-6 bg-orange-500 rounded-full inline-block"></span> Mission</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                Empower educational institutions to deliver better placement outcomes by unifying job management, candidate sourcing, and hiring analytics into a single platform.
              </p>
            </Card>

            <Card className="bg-white/45 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 p-8 rounded-3xl shadow-xl hover:-translate-y-1 transition-transform duration-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><span className="w-1.5 h-6 bg-slate-500 rounded-full inline-block"></span> Vision</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                Be the trusted placement ecosystem where students discover careers, employers discover talent, and officers drive measurable placement growth.
              </p>
            </Card>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: '100+', text: 'Partner Institutions' },
              { title: '92%', text: 'Average Offer Rate' },
              { title: '1200+', text: 'Students Placed' },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-lg border border-white/40 dark:border-slate-700/50 p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
                <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-black dark:from-orange-400 dark:to-orange-200">{item.title}</p>
                <p className="mt-3 text-gray-700 dark:text-gray-300 font-medium">{item.text}</p>
              </div>
            ))}
          </div>

          <section className="mt-16 pb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Integrity', description: 'Data privacy and transparency in every placement decision.' },
                { title: 'Innovation', description: 'Continuous product evolution with AI-powered matching and intelligent insights.' },
                { title: 'Impact', description: 'Deliver measurable outcomes for students and employers.' },
              ].map((item) => (
                <Card key={item.title} className="bg-white/45 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
                </Card>
              ))}
            </div>
          </section>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
