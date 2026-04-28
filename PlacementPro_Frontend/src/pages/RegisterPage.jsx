import React, { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import { validateEmail, validatePassword, validateName } from '../utils/validation';
import { Users, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const { register } = useAuthContext();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!validateName(formData.name)) newErrors.name = 'Name must be at least 2 characters';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!validatePassword(formData.password)) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await register(formData);
      setLoading(false);
      if (result.success) {
        showToast('Registration successful. Please login.', 'success');
        navigate('/login');
      } else {
        showToast(result.message || 'Registration failed', 'error');
      }
    } catch (err) {
      setLoading(false);
      showToast('An error occurred during registration', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-10 relative overflow-hidden transition-colors duration-200">
      
      {/* Modern Aurora UI / Apple-style Mesh Gradient Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-orange-400/30 dark:bg-orange-600/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-slate-400/30 dark:bg-slate-600/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '12s' }}></div>
      <div className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-yellow-400/20 dark:bg-orange-800/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '10s' }}></div>

      <div className="w-full max-w-4xl relative z-10">
        <div className="bg-white/45 dark:bg-slate-900/50 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-2xl rounded-[24px] overflow-hidden transition-all duration-300">
          <div className="relative">
            <button
              onClick={() => navigate('/')}
              className="absolute left-4 top-4 inline-flex items-center justify-center p-2 rounded-full bg-white border border-gray-100 shadow-sm hover:shadow-md transition"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-4 h-4 text-gray-700" />
              <span className="sr-only">Back to Home</span>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left: Form */}
              <div className="p-8 md:p-10">
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">Create your PlacementPro account</h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Sign up and start managing campus placements with a modern, secure platform.</p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                    <div className={`mt-1 flex items-center gap-3 px-3 py-2 border rounded-lg ${errors.name ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-slate-700'} bg-white/60 dark:bg-slate-900/50 transition`}>
                      <Users className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <input name="name" value={formData.name} onChange={handleChange} className="flex-1 outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500" placeholder="John Doe" />
                    </div>
                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <div className={`mt-1 flex items-center gap-3 px-3 py-2 border rounded-lg ${errors.email ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-slate-700'} bg-white/60 dark:bg-slate-900/50 transition`}>
                      <Mail className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <input name="email" value={formData.email} onChange={handleChange} className="flex-1 outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500" placeholder="you@school.edu" />
                    </div>
                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                    <div className={`mt-1 flex items-center gap-3 px-3 py-2 border rounded-lg ${errors.password ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-slate-700'} bg-white/60 dark:bg-slate-900/50 transition`}>
                      <Lock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <input name="password" type={showPass ? 'text' : 'password'} value={formData.password} onChange={handleChange} className="flex-1 outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500" placeholder="Create a password" />
                      <button type="button" onClick={() => setShowPass(s => !s)} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">{showPass ? 'Hide' : 'Show'}</button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">At least 6 characters</p>
                    {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
                    <div className={`mt-1 px-3 py-2 border rounded-lg ${errors.confirmPassword ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-slate-700'} bg-white/60 dark:bg-slate-900/50 transition`}>
                      <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} className="w-full outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500" placeholder="Confirm your password" />
                    </div>
                    {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>

                  <div className="pt-2">
                    <Button variant="gradient" type="submit" size="fullWidth" loading={loading} disabled={loading}>
                      Create Account
                    </Button>
                  </div>

                  <div className="text-center mt-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Already have an account? <button onClick={() => navigate('/login')} className="text-orange-600 dark:text-orange-400 hover:text-orange-700 font-medium">Sign in</button></p>
                  </div>
                </form>
              </div>

              {/* Right: Illustration / Info */}
              <div className="hidden md:flex flex-col justify-center items-stretch bg-white/20 dark:bg-slate-800/30 backdrop-blur-lg p-8">
                <div className="mx-auto text-center max-w-xs">
                  <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80" alt="students and recruiters" className="w-full h-40 object-cover rounded-lg shadow-sm mb-4" />
                  <h3 className="text-lg font-semibold dark:text-white">Student registration only</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Self-service signup creates a student account. Employers, placement officers, and admins are created from the admin dashboard.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
