import React from 'react';
import { Link } from 'react-router-dom';
import { usePlacementData } from '../context/PlacementDataContext';
import Card from '../components/Card';
import { JOB_STATUS } from '../utils/status';

const JobsPage = () => {
  const { placementData } = usePlacementData();
  const jobs = placementData.jobs.filter(j => j.status === JOB_STATUS.OPEN);

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden transition-colors duration-200">
      {/* Modern Aurora UI / Apple-style Mesh Gradient Background */}
      <div className="absolute top-[-5%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-orange-400/20 dark:bg-orange-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-[20%] right-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-slate-400/20 dark:bg-slate-600/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '12s' }}></div>
      <div className="absolute top-[30%] left-[30%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-yellow-400/10 dark:bg-orange-800/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '10s' }}></div>

      <section className="max-w-6xl mx-auto p-6 sm:p-10 relative z-10 pt-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Job Listings</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Discover and apply to top opportunities.</p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {jobs.length > 0 ? jobs.map(job => (
            <Card key={job.id} className="bg-white/45 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{job.title}</h2>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">{job.companyName} <span className="mx-1">•</span> {job.location}</p>
              <p className="text-gray-700 dark:text-gray-300 line-clamp-2 mt-4">{job.description}</p>
              
              <div className="mt-6 flex justify-between items-center border-t border-gray-100 dark:border-slate-800/50 pt-4">
                <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 px-3 py-1.5 rounded-full tracking-wide uppercase">
                  {job.type}
                </span>
                <Link to={`/jobs/${job.id}`} className="text-sm text-white bg-gradient-to-r from-orange-500 to-black hover:from-orange-600 hover:to-black px-5 py-2.5 rounded-full shadow-md hover:shadow-lg hover:shadow-orange-500/20 transition-all font-medium">
                  View Details
                </Link>
              </div>
            </Card>
          )) : <p className="text-gray-500 dark:text-gray-400 text-lg">No jobs available right now.</p>}
        </div>
      </section>
    </div>
  );
};

export default JobsPage;
