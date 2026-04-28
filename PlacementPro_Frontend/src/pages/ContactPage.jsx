import React, { useState } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Loader from '../components/Loader';
import SectionHeader from '../components/SectionHeader';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', organization: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    if (!form.message.trim()) next.message = 'Message cannot be empty';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setStatus('');

    setTimeout(() => {
      setLoading(false);
      setStatus('Your message has been delivered. Our team will contact you within 24 hours.');
      setForm({ name: '', email: '', organization: '', message: '' });
    }, 900);
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden transition-colors duration-200">
      {/* Modern Aurora UI Mesh Gradient Background */}
      <div className="absolute top-[-5%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-orange-400/20 dark:bg-orange-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-[20%] right-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-slate-400/20 dark:bg-slate-600/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '12s' }}></div>
      <div className="absolute top-[30%] left-[30%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-yellow-400/10 dark:bg-orange-800/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '10s' }}></div>

      <div className="relative z-10 py-12">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Get in Touch with PlacementPro"
            subtitle="We respond within one business day for implementation and support inquiries."
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            <div className="space-y-6">
              <Badge label="Need support?" variant="success" />
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">Contact PlacementPro</h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                Have questions about onboarding, integration, or scaling your placements? We’re here to help campuses and employers succeed.
              </p>

              <div className="space-y-4 rounded-3xl bg-white/45 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 p-8 shadow-xl mt-8">
                <div>
                  <p className="text-sm font-bold text-orange-500 uppercase tracking-wider">Email</p>
                  <p className="text-xl font-medium text-gray-900 dark:text-white mt-1">support@placementpro.com</p>
                </div>
                <div className="pt-2">
                  <p className="text-sm font-bold text-orange-500 uppercase tracking-wider">Phone</p>
                  <p className="text-xl font-medium text-gray-900 dark:text-white mt-1">+91 80 1234 5678</p>
                </div>
              </div>

              <div className="rounded-3xl bg-white/45 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 p-8 shadow-xl">
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Office</p>
                <p className="text-gray-900 dark:text-white font-medium text-lg leading-relaxed">
                  Mumbai Education Hub, 3rd Floor, <br/>Khar West, Mumbai, India
                </p>
              </div>
            </div>

            <Card className="bg-white/45 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 p-8 sm:p-10 shadow-2xl rounded-3xl h-fit">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Full Name"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Your name"
                  error={errors.name}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="your@email.com"
                  error={errors.email}
                  required
                />

                <Input
                  label="Organization"
                  value={form.organization}
                  onChange={(e) => setForm((p) => ({ ...p, organization: e.target.value }))}
                  placeholder="University or Company"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message <span className="text-red-500">*</span></label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    rows={5}
                    className={`w-full p-4 bg-white/60 dark:bg-slate-900/50 backdrop-blur-md rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${errors.message ? 'border-red-500 ring-red-500' : 'border-gray-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-slate-500'}`}
                    required
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>

                <div className="pt-2">
                  <Button type="submit" size="fullWidth" disabled={loading} loading={loading} variant="gradient">
                    {loading ? 'Sending...' : 'Submit Request'}
                  </Button>
                </div>

                {status && <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg"><p className="text-green-700 dark:text-green-400 font-medium text-center text-sm">{status}</p></div>}
                {loading && <Loader size="sm" label="Processing request..." className="mt-4 mx-auto" />}
              </form>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;
