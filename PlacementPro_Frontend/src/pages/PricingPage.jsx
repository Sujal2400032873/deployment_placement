import React, { useState } from 'react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import SectionHeader from '../components/SectionHeader';

const PricingPage = () => {
  const [period, setPeriod] = useState('monthly');
  const plans = [
    {
      name: 'Starter',
      price: period === 'monthly' ? '₹0' : '₹0',
      periodLabel: period === 'monthly' ? '/mo' : '/yr',
      features: ['Up to 50 student profiles', '20 job postings', 'Email support', 'Placement dashboard'],
      badge: 'Best for early adoption',
    },
    {
      name: 'Pro',
      price: period === 'monthly' ? '₹999' : '₹9999',
      periodLabel: period === 'monthly' ? '/mo' : '/yr',
      features: ['Unlimited job postings', 'Priority support', 'Advanced analytics', 'Candidate messaging'],
      badge: 'Most popular',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      periodLabel: '',
      features: ['Dedicated onboarding', 'SLA support', 'Multi-team management', 'API & integrations'],
      badge: 'Custom solution',
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden transition-colors duration-200">
      {/* Modern Aurora UI Mesh Gradient Background */}
      <div className="absolute top-[-5%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-orange-400/20 dark:bg-orange-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-[20%] right-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-slate-400/20 dark:bg-slate-600/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '12s' }}></div>
      <div className="absolute top-[30%] left-[30%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-yellow-400/10 dark:bg-orange-800/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '10s' }}></div>

      <div className="relative z-10 pt-12 pb-16">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Flexible Pricing for Every Campus"
            subtitle="Choose the plan that matches your placement scale and team needs."
          />

          <div className="flex justify-center w-full">
            <div className="inline-flex rounded-full border border-orange-200/50 dark:border-slate-700/50 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md shadow-sm mt-3 text-sm overflow-hidden p-1">
              <button onClick={() => setPeriod('monthly')} className={`px-5 py-2 rounded-full font-medium transition-all ${period === 'monthly' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400'}`}>
                Monthly
              </button>
              <button onClick={() => setPeriod('yearly')} className={`px-5 py-2 rounded-full font-medium transition-all ${period === 'yearly' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400'}`}>
                Yearly
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {plans.map((plan) => (
              <Card key={plan.name} className="bg-white/45 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="p-8 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h2>
                    <Badge label={plan.badge} variant={plan.name === 'Pro' ? 'success' : 'secondary'} />
                  </div>
                  <p className="text-4xl font-extrabold text-gray-900 dark:text-white">
                    {plan.price}
                    <span className="text-base font-medium text-gray-600 dark:text-gray-400">{plan.periodLabel}</span>
                  </p>
                  <ul className="mt-8 space-y-3 text-gray-700 dark:text-gray-300">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <span className="mt-1 text-orange-500 font-bold">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-10">
                    <Button variant={plan.name === 'Pro' ? 'gradient' : 'secondary'} className="w-full" size="fullWidth">
                      {plan.name === 'Enterprise' ? 'Contact Sales' : 'Choose Plan'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center text-sm text-gray-600 dark:text-gray-400 pb-10">
            <p className="max-w-2xl mx-auto">
              All plans include secure data handling, role-based access, and real-time placement insights. Yearly plans save up to 20%.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PricingPage;
