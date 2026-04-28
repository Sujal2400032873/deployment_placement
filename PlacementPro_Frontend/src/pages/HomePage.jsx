import React, { useState } from 'react';
import { Users, Briefcase, TrendingUp, Shield } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import SectionHeader from '../components/SectionHeader';
import StatCard from '../components/StatCard';
import Reveal from '../components/Reveal';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Briefcase,
      title: 'Job Postings',
      description: 'Employers can post curated campus roles with structured workflows and automated shortlists.',
    },
    {
      icon: Users,
      title: 'Student Engagement',
      description: 'Students can discover roles, submit profiles, and track progress with a modern dashboard.',
    },
    {
      icon: TrendingUp,
      title: 'Analytics & Reports',
      description: 'Placement officers gain deployment-ready insights on hires, success rates, and trends.',
    },
    {
      icon: Shield,
      title: 'Secure & Compliant',
      description: 'Role-based access, encrypted storage, and audit-ready activity history for peace of mind.',
    },
  ];

  const stats = [
    { value: '4.8/5', label: 'User Satisfaction' },
    { value: '100+', label: 'Partner Institutions' },
    { value: '1.2K+', label: 'Jobs fulfilled' },
    { value: '92%', label: 'Offer Rate' },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_40%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.08),_transparent_40%)] dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.1),_transparent_40%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.05),_transparent_40%)] text-gray-800 dark:text-gray-100 transition-colors duration-200">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <Reveal className="space-y-6" delay={100}>
            <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-blue-100 text-blue-700 font-semibold">
              <Badge label="Enterprise Grade" variant="success" />
              <span>Trusted by recruitment teams at top institutions</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              Modern Placement management for students, employers, and officers
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              PlacementPro delivers end-to-end placement workflows with transparency, intelligent matching, and robust analytics designed for campus recruitment excellence.
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <StatCard key={stat.label} value={stat.value} label={stat.label} />
              ))}
            </div>

            <div className="flex pt-4">
              <Button variant="gradient" size="lg" onClick={() => navigate('/register')}>
                Create Account
              </Button>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Badge label="24/7 Support" variant="info" />
              <Badge label="GST-enabled Billing" variant="primary" />
              <Badge label="Role-based Access" variant="secondary" />
            </div>
          </Reveal>

          <Reveal className="relative" delay={300}>
            <div className="h-96 rounded-3xl overflow-hidden shadow-2xl border border-white/30 bg-gradient-to-br from-indigo-500 via-blue-500 to-sky-500">
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=65"
                alt="Team working on placement metrics"
                className="w-full h-full object-cover opacity-80"
              />
            </div>
            <div className="absolute left-6 top-6 bg-white/30 backdrop-blur-md rounded-xl p-4 border border-white/40 text-sm">
              <p className="font-semibold text-gray-900">Smart match score</p>
              <p className="text-gray-600">75% faster shortlisting with AI-based candidate rankings.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white/80 dark:bg-slate-900/80 py-16 md:py-24 transition-colors duration-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Platform Capabilities</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">One platform with purpose-driven modules for each role in your placement ecosystem.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Reveal key={index} delay={index * 150}>
                  <Card className="hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border-gray-200 rounded-[20px] h-full">
                    <div className="text-center py-8 px-4">
                      <div className="mx-auto w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-blue-700" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
                    </div>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trusted companies section */}
      <section className="py-16 overflow-hidden">
        <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4 text-center">Trusted by 100+ campuses</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
            {['IIT', 'NIT', 'IIIT', 'BHU'].map((label, i) => (
              <Reveal key={label} delay={i * 100} className="w-full">
                <div className="h-14 bg-gray-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-semibold text-gray-700 dark:text-gray-300 transition-colors w-full">{label}</div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-500 to-black text-white py-16 md:py-24 overflow-hidden">
        <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" delay={200}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Accelerate your placement pipeline today</h2>
          <p className="text-lg mb-8 text-blue-100 max-w-2xl mx-auto">Start a free trial and onboard your first batch in under 10 minutes with guided setup, profile imports, and automated candidate recommendations.</p>
          <Button variant="secondary" size="lg" className="border border-white/20 bg-white/10 hover:bg-white text-white hover:text-orange-600 backdrop-blur-sm shadow-xl" onClick={() => navigate('/register')}>
            Start Free Trial
          </Button>
        </Reveal>
      </section>
    </div>
  );
};

export default HomePage;

