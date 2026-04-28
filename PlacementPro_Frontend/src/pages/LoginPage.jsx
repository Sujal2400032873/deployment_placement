import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import { validateEmail, validatePassword } from '../utils/validation';
import { useAuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { normalizeRole } from '../utils/auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuthContext();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Please enter a valid email';

    if (!password) newErrors.password = 'Password is required';
    else if (!validatePassword(password)) newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await login(email, password);
      setLoading(false);
      if (result.success && result.role) {
        showToast('Login successful', 'success');
        const role = normalizeRole(result.role);
        if (role === 'ROLE_ADMIN') {
          navigate('/admin/dashboard');
        } else if (role === 'ROLE_EMPLOYER') {
          navigate('/employer/dashboard');
        } else if (role === 'ROLE_PLACEMENT_OFFICER') {
          navigate('/placement/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      } else {
        showToast(result.message || 'Invalid credentials', 'error');
      }
    } catch (err) {
      setLoading(false);
      console.error('Login error:', err);
      showToast('An error occurred during login', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-200">
      
      {/* Modern Aurora UI / Apple-style Mesh Gradient Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-orange-400/30 dark:bg-orange-600/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-slate-400/30 dark:bg-slate-600/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '12s' }}></div>
      <div className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-yellow-400/20 dark:bg-orange-800/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '10s' }}></div>

      <div className="w-full max-w-md relative z-10">
        <button
          onClick={() => navigate('/')}
          className="absolute left-4 top-4 inline-flex items-center justify-center p-2 rounded-full bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        </button>

        <div className="bg-white/45 dark:bg-slate-900/50 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-2xl rounded-[24px] p-8 mb-6 transition-all duration-300">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h2>
            <p className="text-gray-600 dark:text-gray-400">Sign in to your PlacementPro account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              error={errors.email}
              required
              icon={Mail}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              error={errors.password}
              required
              icon={Lock}
            />

            <Button variant="gradient" type="submit" size="fullWidth" loading={loading} disabled={loading}>
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Don't have an account?{' '}
              <button onClick={() => navigate('/register')} className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium transition-colors">
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
