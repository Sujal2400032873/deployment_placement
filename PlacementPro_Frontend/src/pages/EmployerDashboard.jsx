import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Users, DollarSign, Clock, Eye, EyeOff, ExternalLink } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { getJobsByEmployer, getApplicationsForJob, formatDate } from '../utils/dataHelpers';
import { validateJobTitle } from '../utils/validation';

// Employer dashboard for managing job postings and applications
import { useAuthContext } from '../context/AuthContext';
import { usePlacementData } from '../context/PlacementDataContext';
import { useToast } from '../context/ToastContext';
import { APPLICATION_STATUS, JOB_STATUS, formatStatusLabel, getApplicationStatusColor, getJobStatusColor } from '../utils/status';
import API from '../api/axios';

const EmployerDashboard = () => {
  const { user } = useAuthContext();
  const { placementData, postJob, updateJob, deleteJob, updateApplicationStatus } = usePlacementData();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('jobs'); // jobs or applications
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);
  const [selectedJobForApps, setSelectedJobForApps] = useState(null);
  const [jobFormData, setJobFormData] = useState({
    title: '',
    companyName: '',
    location: '',
    description: '',
    requirements: '',
    salary: '',
    type: 'Full-time',
    status: JOB_STATUS.OPEN,
  });
  const [errors, setErrors] = useState({});

  const resolveResumeUrl = (resumeUrl) => {
    if (!resumeUrl) return null;
    if (/^https?:\/\//i.test(resumeUrl)) return resumeUrl;
    const backendBase = (API.defaults.baseURL || '').replace(/\/api\/?$/, '');
    const normalizedPath = resumeUrl.startsWith('/') ? resumeUrl : `/${resumeUrl}`;
    return `${backendBase}${normalizedPath}`;
  };

  // Get employer's jobs
  const employerJobs = getJobsByEmployer(user.id, placementData);

  // Validate job form
  const validateJobForm = () => {
    const newErrors = {};
    if (!validateJobTitle(jobFormData.title)) newErrors.title = 'Job title is required';
    if (!jobFormData.companyName) newErrors.companyName = 'Company name is required';
    if (!jobFormData.location) newErrors.location = 'Location is required';
    if (!jobFormData.description) newErrors.description = 'Description is required';
    if (!jobFormData.requirements) newErrors.requirements = 'Requirements are required';
    if (!jobFormData.salary) newErrors.salary = 'Salary is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save job
  const handleSaveJob = async () => {
    if (!validateJobForm()) return;

    let result;
    if (editingJob) {
      // Update existing job
      result = await updateJob(editingJob.id, jobFormData);
    } else {
      // Add new job
      result = await postJob(jobFormData);
    }

    if (result.success) {
      showToast(editingJob ? 'Job updated successfully' : 'Job posted successfully');
      handleCloseJobModal();
    } else {
      showToast(result.message || 'Operation failed', 'error');
    }
  };

  // Handle delete job
  const handleDeleteJob = async (jobId) => {
    if (confirm('Are you sure you want to delete this job?')) {
      const result = await deleteJob(jobId);
      if (result.success) {
        showToast('Job deleted successfully');
      } else {
        showToast(result.message || 'Deletion failed', 'error');
      }
    }
  };

  // Handle edit job
  const handleEditJob = (job) => {
    setEditingJob(job);
    setJobFormData({
      title: job.title,
      companyName: job.companyName,
      location: job.location,
      description: job.description,
      requirements: job.requirements,
      salary: job.salary,
      type: job.type,
      status: job.status,
    });
    setIsJobModalOpen(true);
  };

  // Handle close job modal
  const handleCloseJobModal = () => {
    setIsJobModalOpen(false);
    setEditingJob(null);
    setJobFormData({
      title: '',
      companyName: '',
      location: '',
      description: '',
      requirements: '',
      salary: '',
      type: 'Full-time',
      status: JOB_STATUS.OPEN,
    });
    setErrors({});
  };

  const handleToggleJobStatus = async (job, status) => {
    const result = await updateJob(job.id, { ...job, status });
    if (result.success) {
        showToast('Job status updated');
    } else {
        showToast(result.message || 'Update failed', 'error');
    }
  };

  // Handle update application status
  const handleUpdateApplicationStatus = async (applicationId, newStatus) => {
    const result = await updateApplicationStatus(applicationId, newStatus);
    if (result.success) {
      showToast('Application status updated');
    } else {
      showToast(result.message || 'Update failed', 'error');
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
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Employer Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage job postings and review applications</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8 flex gap-2 border-b border-gray-200 dark:border-slate-700/50">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors duration-200 ${
            activeTab === 'jobs'
              ? 'border-orange-500 text-orange-600 dark:text-orange-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Job Postings ({employerJobs.length})
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors duration-200 ${
            activeTab === 'applications'
              ? 'border-orange-500 text-orange-600 dark:text-orange-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Applications
        </button>
      </div>

      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <div>
          <div className="mb-6">
            <Button onClick={() => {
              setEditingJob(null);
              setJobFormData({
                title: '',
                companyName: '',
                location: '',
                description: '',
                requirements: '',
                salary: '',
                type: 'Full-time',
                status: JOB_STATUS.OPEN,
              });
              setIsJobModalOpen(true);
            }}>
              <Plus className="w-4 h-4" />
              <span>Post New Job</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {employerJobs.length > 0 ? (
              employerJobs.map(job => (
                <Card key={job.id} className={job.status !== JOB_STATUS.OPEN ? 'opacity-80 bg-gray-50' : ''}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-600">{job.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {job.status === JOB_STATUS.OPEN ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getJobStatusColor(job.status)}`}>
                        {formatStatusLabel(job.status)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" />
                      {job.salary}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {job.type}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      {getApplicationsForJob(job.id, placementData).length} applications
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{job.description}</p>

                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => handleEditJob(job)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    {job.status !== JOB_STATUS.CLOSED && (
                      <Button size="sm" variant="secondary" onClick={() => handleToggleJobStatus(job, JOB_STATUS.CLOSED)}>
                        Close
                      </Button>
                    )}
                    {job.status === JOB_STATUS.CLOSED && (
                      <Button size="sm" variant="secondary" onClick={() => handleToggleJobStatus(job, JOB_STATUS.OPEN)}>
                        Reopen
                      </Button>
                    )}
                    <Button size="sm" variant="secondary" onClick={() => {
                      setSelectedJobForApps(job);
                      setIsApplicationsModalOpen(true);
                    }}>
                      View ({getApplicationsForJob(job.id, placementData).length})
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDeleteJob(job.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="col-span-2">
                <div className="text-center py-12">
                  <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">You haven't posted any jobs yet</p>
                  <Button onClick={() => setIsJobModalOpen(true)}>
                    Post First Job
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Applications Tab */}
      {activeTab === 'applications' && (
        <div>
          {employerJobs.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Post a job to receive applications</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {employerJobs.map(job => {
                const applications = getApplicationsForJob(job.id, placementData);
                return (
                  <Card key={job.id}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{job.title}</h3>
                    {applications.length > 0 ? (
                      <div className="space-y-3">
                        {applications.map(app => {
                          return (
                            <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{app.studentName || 'Unknown Student'}</p>
                                <p className="text-sm text-gray-600">{app.studentEmail || 'Email unavailable'}</p>
                                <p className="text-xs text-gray-500 mt-1">Phone: {app.phone || 'Not provided'}</p>
                                <p className="text-xs text-gray-500">Course: {app.course || 'Not provided'}</p>
                                <p className="text-xs text-gray-500">Branch: {app.branch || 'Not provided'}</p>
                                <p className="text-xs text-gray-500">CGPA: {app.cgpa ?? 'Not provided'}</p>
                                <p className="text-xs text-gray-500">Skills: {app.skills || 'Not provided'}</p>
                                <p className="text-xs text-gray-500 mt-1">Applied {formatDate(app.appliedAt || app.appliedDate)}</p>
                                {app.resumeUrl ? (
                                  <button
                                    onClick={() => window.open(resolveResumeUrl(app.resumeUrl), '_blank', 'noopener,noreferrer')}
                                    className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700"
                                  >
                                    View Resume
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <p className="mt-2 text-xs text-gray-500">No resume uploaded</p>
                                )}
                              </div>

                              <div className="flex items-center gap-3">
                                <select
                                  value={app.status}
                                  onChange={(e) => handleUpdateApplicationStatus(app.id, e.target.value)}
                                  className={`px-3 py-1 rounded-full text-xs font-semibold border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 ${getApplicationStatusColor(app.status)}`}
                                >
                                  <option value={APPLICATION_STATUS.APPLIED}>Applied</option>
                                  <option value={APPLICATION_STATUS.SHORTLISTED}>Shortlisted</option>
                                  <option value={APPLICATION_STATUS.INTERVIEWED}>Interview</option>
                                  <option value={APPLICATION_STATUS.APPROVED}>Approve</option>
                                  <option value={APPLICATION_STATUS.REJECTED}>Rejected</option>
                                  <option value={APPLICATION_STATUS.REMOVED}>Remove Candidate</option>
                                </select>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-sm">No applications yet</p>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Job Modal */}
      <Modal
        isOpen={isJobModalOpen}
        onClose={handleCloseJobModal}
        title={editingJob ? 'Edit Job' : 'Post New Job'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseJobModal}>
              Cancel
            </Button>
            <Button onClick={handleSaveJob}>
              {editingJob ? 'Update' : 'Post'} Job
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Job Title"
            value={jobFormData.title}
            onChange={(e) => {
              setJobFormData({ ...jobFormData, title: e.target.value });
              if (errors.title) setErrors({ ...errors, title: '' });
            }}
            error={errors.title}
            required
          />

          <Input
            label="Company Name"
            value={jobFormData.companyName}
            onChange={(e) => {
              setJobFormData({ ...jobFormData, companyName: e.target.value });
              if (errors.companyName) setErrors({ ...errors, companyName: '' });
            }}
            error={errors.companyName}
            required
          />

          <Input
            label="Location"
            value={jobFormData.location}
            onChange={(e) => {
              setJobFormData({ ...jobFormData, location: e.target.value });
              if (errors.location) setErrors({ ...errors, location: '' });
            }}
            error={errors.location}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Salary"
              value={jobFormData.salary}
              onChange={(e) => {
                setJobFormData({ ...jobFormData, salary: e.target.value });
                if (errors.salary) setErrors({ ...errors, salary: '' });
              }}
              error={errors.salary}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
              <select
                value={jobFormData.type}
                onChange={(e) => setJobFormData({ ...jobFormData, type: e.target.value })}
                className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={jobFormData.status}
                onChange={(e) => setJobFormData({ ...jobFormData, status: e.target.value })}
                className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
              >
                <option value={JOB_STATUS.OPEN}>Open</option>
                <option value={JOB_STATUS.DRAFT}>Draft</option>
                <option value={JOB_STATUS.CLOSED}>Closed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={jobFormData.description}
              onChange={(e) => {
                setJobFormData({ ...jobFormData, description: e.target.value });
                if (errors.description) setErrors({ ...errors, description: '' });
              }}
              placeholder="Job description..."
              rows="4"
              className={`w-full px-4 py-2 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${errors.description ? 'border-red-500' : ''}`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Requirements <span className="text-red-500">*</span>
            </label>
            <textarea
              value={jobFormData.requirements}
              onChange={(e) => {
                setJobFormData({ ...jobFormData, requirements: e.target.value });
                if (errors.requirements) setErrors({ ...errors, requirements: '' });
              }}
              placeholder="Required qualifications and skills..."
              rows="4"
              className={`w-full px-4 py-2 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${errors.requirements ? 'border-red-500' : ''}`}
            />
            {errors.requirements && <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>}
          </div>
        </div>
      </Modal>

      {/* Applications Detail Modal */}
      {selectedJobForApps && (
        <Modal
          isOpen={isApplicationsModalOpen}
          onClose={() => {
            setIsApplicationsModalOpen(false);
            setSelectedJobForApps(null);
          }}
          title={`Applications for ${selectedJobForApps.title}`}
          size="lg"
          footer={
            <Button onClick={() => setIsApplicationsModalOpen(false)}>
              Close
            </Button>
          }
        >
          {/* Applications will be displayed here */}
          <div className="text-center text-gray-600">
            Use the Applications tab to manage applications
          </div>
        </Modal>
      )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
