import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlacementData } from '../context/PlacementDataContext';
import Card from '../components/Card';
import { ArrowLeft } from 'lucide-react';

const JobDetailsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { placementData } = usePlacementData();
  const job = placementData.jobs.find(j => String(j.id) === String(jobId));

  if (!job) {
    return (
      <div className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden flex items-center justify-center">
        <p className="text-2xl text-gray-500 dark:text-gray-400">Job not found</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden transition-colors duration-200">
      {/* Modern Aurora UI / Apple-style Mesh Gradient Background */}
      <div className="absolute top-[-5%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-orange-400/20 dark:bg-orange-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-[20%] right-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-slate-400/20 dark:bg-slate-600/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '12s' }}></div>
      <div className="absolute top-[30%] left-[30%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-yellow-400/10 dark:bg-orange-800/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '10s' }}></div>

      <section className="max-w-4xl mx-auto p-6 sm:p-10 relative z-10 pt-10">
        <Card className="bg-white/45 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-2xl overflow-hidden transition-all duration-300 p-8 sm:p-12">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start md:items-center mb-8 gap-4 border-b border-gray-200/50 dark:border-slate-700/50 pb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">{job.title}</h1>
            <button onClick={() => navigate('/jobs')} className="group flex items-center justify-center gap-2 text-sm px-5 py-2.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all font-medium border border-gray-200/60 dark:border-slate-600 shadow-sm hover:shadow dark:text-gray-200 shrink-0">
              <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:-translate-x-1 transition-transform" /> 
              Back to jobs
            </button>
          </div>
          
          {/* Details Grid */}
          <div className="space-y-8 text-gray-700 dark:text-gray-300 text-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 bg-white/30 dark:bg-slate-800/30 p-6 rounded-2xl border border-white/40 dark:border-slate-700/30">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Company</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{job.companyName}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Location</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{job.location}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Job Type</span>
                <span className="inline-block px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-lg text-sm font-semibold max-w-max">
                  {job.type}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Salary</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{job.salary}</span>
              </div>
            </div>
            
            {/* Description section */}
            <div className="pt-4">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
                <span className="w-1.5 h-6 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full inline-block shadow-sm"></span> 
                Description
              </h2>
              <p className="leading-relaxed text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{job.description}</p>
            </div>
            
            {/* Requirements section */}
            <div className="pt-4">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
                <span className="w-1.5 h-6 bg-gradient-to-b from-slate-400 to-slate-600 rounded-full inline-block shadow-sm"></span> 
                Requirements
              </h2>
              <p className="leading-relaxed text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{job.requirements}</p>
            </div>
          </div>
          
        </Card>
      </section>
    </div>
  );
};

export default JobDetailsPage;
