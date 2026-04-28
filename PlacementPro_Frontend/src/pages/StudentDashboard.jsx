import React, { useEffect, useState } from 'react';
import { Briefcase, Filter, Plus, MapPin, DollarSign, Clock, Search } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { getApplicationsForStudent, getJobById, formatDate } from '../utils/dataHelpers';

// Student dashboard for job search and application tracking
import { useAuthContext } from '../context/AuthContext';
import { usePlacementData } from '../context/PlacementDataContext';
import { useToast } from '../context/ToastContext';
import { getResumeUrl } from '../utils/auth';
import { JOB_STATUS, formatStatusLabel, getApplicationStatusColor } from '../utils/status';

const StudentDashboard = () => {
  const { user } = useAuthContext();
  const { placementData, applyToJob } = usePlacementData();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('browse'); // browse or applications
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ jobType: '', location: '', searchTerm: '' });
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [isApplyFormOpen, setIsApplyFormOpen] = useState(false);
  const [applyJob, setApplyJob] = useState(null);
  const [applyForm, setApplyForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    course: '',
    branch: '',
    cgpa: '',
    skills: '',
    resumeUrl: '',
    coverLetter: ''
  });
  const [applyErrors, setApplyErrors] = useState({});
  const [applyButtonActive, setApplyButtonActive] = useState(false);

  useEffect(() => {
    if (!user) return;
    setApplyForm((current) => ({
      ...current,
      fullName: user.name || '',
      email: user.email || '',
      branch: user.studentProfile?.branch || '',
      cgpa: user.studentProfile?.cgpa ?? '',
      skills: user.studentProfile?.skills || '',
      resumeUrl: getResumeUrl(user)
    }));
  }, [user]);

  // Get student's applications
  const studentApplications = getApplicationsForStudent(user.id, placementData);

  // Filter jobs based on search and filters
  const availableJobs = placementData.jobs.filter(job => {
    if (job.status !== JOB_STATUS.OPEN) return false;

    // Check if student already applied
    const alreadyApplied = studentApplications.some(app => app.jobId === job.id);
    if (alreadyApplied) return false;

    // Apply other filters
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      if (!job.title.toLowerCase().includes(term) &&
          !job.companyName.toLowerCase().includes(term) &&
          !job.location.toLowerCase().includes(term)) {
        return false;
      }
    }

    if (filters.jobType && job.type !== filters.jobType) return false;
    if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) return false;

    return true;
  });

  // Handle job application request open for form
  const openApplyModal = (job) => {
    setApplyJob(job);
    setApplyForm({
      fullName: user.name || '',
      email: user.email || '',
      phone: '',
      course: '',
      branch: user.studentProfile?.branch || '',
      cgpa: user.studentProfile?.cgpa ?? '',
      skills: user.studentProfile?.skills || '',
      resumeUrl: getResumeUrl(user),
      coverLetter: ''
    });
    setApplyErrors({});
    setIsApplyFormOpen(true);
  };

  const handleApplySubmit = async (job) => {
    const errors = {};
    if (!applyForm.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!applyForm.email.trim() || !/^\S+@\S+\.\S+$/.test(applyForm.email)) errors.email = 'Valid email required';
    if (!applyForm.phone.trim()) errors.phone = 'Phone number is required';
    if (!applyForm.course.trim()) errors.course = 'Course is required';
    if (!applyForm.branch.trim()) errors.branch = 'Branch is required';
    if (applyForm.cgpa === '' || Number.isNaN(Number(applyForm.cgpa))) errors.cgpa = 'Valid CGPA is required';
    if (!applyForm.skills.trim()) errors.skills = 'Skills are required';
    if (!applyForm.resumeUrl.trim()) errors.resumeUrl = 'Resume link is required';
    if (!applyForm.coverLetter.trim()) errors.coverLetter = 'Cover letter is required';

    setApplyErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setApplyButtonActive(true);
    
    // Call the actual API via context
    const result = await applyToJob(job.id, {
      phone: applyForm.phone.trim(),
      course: applyForm.course.trim(),
      branch: applyForm.branch.trim(),
      cgpa: Number(applyForm.cgpa),
      skills: applyForm.skills.trim(),
      resumeUrl: applyForm.resumeUrl.trim(),
      coverLetter: applyForm.coverLetter.trim(),
      notes: applyForm.coverLetter.trim()
    });
    
    setApplyButtonActive(false);

    if (result.success) {
      setIsApplyFormOpen(false);
      setIsDetailModalOpen(false);
      setSelectedJob(null);
      showToast('Application submitted successfully', 'success');
    } else {
      showToast(result.message || 'Application failed', 'error');
    }
  };


  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden transition-colors duration-200">
      {/* Modern Aurora UI Mesh Gradient Background */}
      <div className="absolute top-[0%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-orange-400/20 dark:bg-orange-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-[-10%] right-[0%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-slate-400/20 dark:bg-slate-600/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '12s' }}></div>
      <div className="absolute top-[20%] right-[20%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-yellow-400/10 dark:bg-orange-800/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '10s' }}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Student Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Find jobs, apply, and track your applications.</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8 flex gap-2 border-b border-gray-200 dark:border-slate-700/50">
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors duration-200 ${
            activeTab === 'browse'
              ? 'border-orange-500 text-orange-600 dark:text-orange-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <Briefcase className="w-4 h-4 inline mr-2" />
          Browse Jobs ({availableJobs.length})
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors duration-200 ${
            activeTab === 'applications'
              ? 'border-orange-500 text-orange-600 dark:text-orange-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <Plus className="w-4 h-4 inline mr-2" />
          My Applications ({studentApplications.length})
        </button>
      </div>

      {/* Browse Jobs Tab */}
      {activeTab === 'browse' && (
        <div>
          {/* Search and Filters */}
          <Card className="mb-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search job title, company, or location..."
                      value={filters.searchTerm}
                      onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select
                  value={filters.jobType}
                  onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                  className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                >
                  <option value="">All Job Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                </select>

                <input
                  type="text"
                  placeholder="Filter by location..."
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                />
              </div>
            </div>
          </Card>

          {/* Jobs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableJobs.length > 0 ? (
              availableJobs.map(job => (
                <Card key={job.id} hoverable onClick={() => {
                  setSelectedJob(job);
                  setIsDetailModalOpen(true);
                }} className="cursor-pointer">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.companyName}</p>
                  </div>

                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" />
                      {job.salary}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {job.type}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{job.description}</p>

                  <Button size="sm" onClick={() => {
                    setSelectedJob(job);
                    setIsDetailModalOpen(true);
                  }}>
                    View Details
                  </Button>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No jobs available matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Applications Tab */}
      {activeTab === 'applications' && (
        <div>
          {studentApplications.length > 0 ? (
            <div className="space-y-4">
              {studentApplications.map(app => {
                const job = getJobById(app.jobId, placementData);
                return (
                  <Card key={app.id}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{job?.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{job?.companyName} • {job?.location}</p>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getApplicationStatusColor(app.status)}`}>
                            {formatStatusLabel(app.status)}
                          </span>
                          <p className="text-xs text-gray-500">Applied on {formatDate(app.appliedAt)}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">You haven't applied to any jobs yet</p>
                <Button onClick={() => setActiveTab('browse')}>
                  Browse Jobs
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Job Detail Modal */}
      {selectedJob && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedJob(null);
          }}
          title={selectedJob.title}
          size="lg"
          footer={
            <>
              <Button variant="secondary" onClick={() => {
                setIsDetailModalOpen(false);
                setSelectedJob(null);
              }}>
                Close
              </Button>
              <Button
                onClick={() => {
                  setApplyButtonActive(true);
                  setTimeout(() => setApplyButtonActive(false), 300);
                  openApplyModal(selectedJob);
                }}
                className={`${applyButtonActive ? 'animate-pop' : ''}`}
                disabled={selectedJob.status !== JOB_STATUS.OPEN}
              >
                Apply Now
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Company</h3>
              <p className="text-gray-600">{selectedJob.companyName}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                <p className="text-gray-600">{selectedJob.location}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Salary</h3>
                <p className="text-gray-600">{selectedJob.salary}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Job Type</h3>
                <p className="text-gray-600">{selectedJob.type}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Status</h3>
                <p className="text-gray-600">{formatStatusLabel(selectedJob.status)}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Posted</h3>
                <p className="text-gray-600">{formatDate(selectedJob.postedAt)}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{selectedJob.description}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Requirements</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{selectedJob.requirements}</p>
            </div>
          </div>
        </Modal>
      )}

      {isApplyFormOpen && applyJob && (
        <Modal
          isOpen={isApplyFormOpen}
          onClose={() => setIsApplyFormOpen(false)}
          title={`Apply for ${applyJob.title}`}
          size="lg"
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsApplyFormOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => handleApplySubmit(applyJob)}
                className={applyButtonActive ? 'animate-pop' : ''}
              >
                Submit Application
              </Button>
            </>
          }
        >
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                value={applyForm.fullName}
                onChange={(e) => setApplyForm({ ...applyForm, fullName: e.target.value })}
                className={`w-full px-4 py-2 bg-white dark:bg-slate-800 border ${applyErrors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors`}
              />
              {applyErrors.fullName && <p className="text-red-500 text-xs mt-1">{applyErrors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={applyForm.email}
                onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                className={`w-full px-4 py-2 bg-white dark:bg-slate-800 border ${applyErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors`}
              />
              {applyErrors.email && <p className="text-red-500 text-xs mt-1">{applyErrors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
              <input
                type="text"
                value={applyForm.phone}
                onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                className={`w-full px-4 py-2 bg-white dark:bg-slate-800 border ${applyErrors.phone ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors`}
              />
              {applyErrors.phone && <p className="text-red-500 text-xs mt-1">{applyErrors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course</label>
              <input
                type="text"
                value={applyForm.course}
                onChange={(e) => setApplyForm({ ...applyForm, course: e.target.value })}
                className={`w-full px-4 py-2 bg-white dark:bg-slate-800 border ${applyErrors.course ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors`}
              />
              {applyErrors.course && <p className="text-red-500 text-xs mt-1">{applyErrors.course}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Branch</label>
              <input
                type="text"
                value={applyForm.branch}
                onChange={(e) => setApplyForm({ ...applyForm, branch: e.target.value })}
                className={`w-full px-4 py-2 bg-white dark:bg-slate-800 border ${applyErrors.branch ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors`}
              />
              {applyErrors.branch && <p className="text-red-500 text-xs mt-1">{applyErrors.branch}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CGPA</label>
              <input
                type="number"
                step="0.01"
                value={applyForm.cgpa}
                onChange={(e) => setApplyForm({ ...applyForm, cgpa: e.target.value })}
                className={`w-full px-4 py-2 bg-white dark:bg-slate-800 border ${applyErrors.cgpa ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors`}
              />
              {applyErrors.cgpa && <p className="text-red-500 text-xs mt-1">{applyErrors.cgpa}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skills</label>
              <input
                type="text"
                value={applyForm.skills}
                onChange={(e) => setApplyForm({ ...applyForm, skills: e.target.value })}
                className={`w-full px-4 py-2 bg-white dark:bg-slate-800 border ${applyErrors.skills ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors`}
              />
              {applyErrors.skills && <p className="text-red-500 text-xs mt-1">{applyErrors.skills}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Resume Link</label>
              <input
                type="url"
                value={applyForm.resumeUrl}
                onChange={(e) => setApplyForm({ ...applyForm, resumeUrl: e.target.value })}
                className={`w-full px-4 py-2 bg-white dark:bg-slate-800 border ${applyErrors.resumeUrl ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors`}
              />
              {applyErrors.resumeUrl && <p className="text-red-500 text-xs mt-1">{applyErrors.resumeUrl}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cover Letter</label>
              <textarea
                rows={4}
                value={applyForm.coverLetter}
                onChange={(e) => setApplyForm({ ...applyForm, coverLetter: e.target.value })}
                className={`w-full px-4 py-2 bg-white dark:bg-slate-800 border ${applyErrors.coverLetter ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors`}
              />
              {applyErrors.coverLetter && <p className="text-red-500 text-xs mt-1">{applyErrors.coverLetter}</p>}
            </div>
          </div>
        </Modal>
      )}
      </div>
    </div>
  );
};

export default StudentDashboard;
