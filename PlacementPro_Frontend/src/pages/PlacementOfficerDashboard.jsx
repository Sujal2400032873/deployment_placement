import React, { useEffect, useMemo, useState } from 'react';
import { Users, Briefcase, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import Card from '../components/Card';
import API from '../api/axios';
import { useToast } from '../context/ToastContext';

const PlacementOfficerDashboard = () => {
  const { showToast } = useToast();
  const [dashboard, setDashboard] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    activeJobs: 0,
    placedStudents: 0,
    pendingApplications: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const response = await API.get('/placement/dashboard');
      setDashboard(response.data);
    } catch (err) {
      console.error('Placement dashboard fetch error:', err);
      showToast(err.response?.data?.message || 'Failed to load placement dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const cards = useMemo(() => ([
    { label: 'Total Students', value: dashboard.totalStudents, icon: Users, color: 'text-blue-600' },
    { label: 'Total Companies', value: dashboard.totalCompanies, icon: Briefcase, color: 'text-green-600' },
    { label: 'Active Jobs', value: dashboard.activeJobs, icon: TrendingUp, color: 'text-orange-600' },
    { label: 'Placed Students', value: dashboard.placedStudents, icon: CheckCircle, color: 'text-emerald-600' },
    { label: 'Pending Applications', value: dashboard.pendingApplications, icon: Clock, color: 'text-purple-600' },
  ]), [dashboard]);

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden transition-colors duration-200">
      {/* Modern Aurora UI Mesh Gradient Background */}
      <div className="absolute top-[0%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-orange-400/20 dark:bg-orange-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-[-10%] right-[0%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-slate-400/20 dark:bg-slate-600/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '12s' }}></div>
      <div className="absolute top-[20%] right-[20%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-yellow-400/10 dark:bg-orange-800/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '10s' }}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Unified Placement Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Track students, companies, jobs, and application pipeline in one place.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-3xl font-bold ${card.color}`}>{loading ? '...' : card.value}</p>
                  <p className="text-gray-600 text-sm mt-1">{card.label}</p>
                </div>
                <Icon className="w-10 h-10 text-gray-200" />
              </div>
            </Card>
          );
        })}
      </div>

      <Card header={<h2 className="text-lg font-semibold text-gray-900">Operational Summary</h2>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
            <p className="text-sm text-gray-600">Student and company coverage</p>
            <p className="mt-2 text-2xl font-bold text-blue-700">
              {loading ? '...' : `${dashboard.totalStudents} students / ${dashboard.totalCompanies} companies`}
            </p>
          </div>
          <div className="rounded-xl border border-orange-100 bg-orange-50 p-5">
            <p className="text-sm text-gray-600">Pipeline health</p>
            <p className="mt-2 text-2xl font-bold text-orange-700">
              {loading ? '...' : `${dashboard.pendingApplications} pending / ${dashboard.placedStudents} progressing`}
            </p>
          </div>
        </div>
      </Card>
      </div>
    </div>
  );
};

export default PlacementOfficerDashboard;
