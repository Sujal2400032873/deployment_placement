import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import { usePlacementData } from '../context/PlacementDataContext';
import Card from '../components/Card';
import { hasRole } from '../utils/auth';
import { formatStatusLabel } from '../utils/status';

const ApplicationsPage = () => {
  const { user } = useAuthContext();
  const { placementData } = usePlacementData();

  let applications = [];
  if (hasRole(user, 'ROLE_STUDENT')) {
    applications = placementData.applications.filter(a => a.studentId === user.id);
  } else if (hasRole(user, 'ROLE_EMPLOYER')) {
    const employerJobs = placementData.jobs.filter(j => j.employerId === user.id).map(j => j.id);
    applications = placementData.applications.filter(a => employerJobs.includes(a.jobId));
  } else {
    applications = placementData.applications;
  }

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden transition-colors duration-200">
      {/* Modern Aurora UI Mesh Gradient Background */}
      <div className="absolute top-[0%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-orange-400/20 dark:bg-orange-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-[-10%] right-[0%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-slate-400/20 dark:bg-slate-600/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '12s' }}></div>
      <div className="absolute top-[20%] right-[20%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-yellow-400/10 dark:bg-orange-800/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '10s' }}></div>

      <section className="relative z-10 max-w-6xl mx-auto p-6 sm:p-10 lg:pt-16">
        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-8">Applications</h1>
        <div className="grid gap-6">
          {applications.length ? applications.map(app => {
            const job = placementData.jobs.find(j => j.id === app.jobId);
            return (
              <Card key={app.id}>
                <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">{job?.title || 'Unknown role'} at {job?.companyName}</p>
                <p className="text-gray-700 dark:text-gray-300 mt-1">Status: <span className="font-semibold text-orange-600 dark:text-orange-400">{formatStatusLabel(app.status)}</span></p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-3">Applied on: {new Date(app.appliedAt).toLocaleDateString()}</p>
              </Card>
            );
          }) : (
            <Card>
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400 font-medium text-lg">No applications yet.</p>
              </div>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
};

export default ApplicationsPage;
