// Helper function to generate unique IDs
export const generateId = (prefix = 'id') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Helper function to format dates to readable format
export const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Helper function to get user by ID from placement data
export const getUserById = (userId, placementData) => {
  return placementData.users.find(u => u.id === userId);
};

// Helper function to get job by ID from placement data
export const getJobById = (jobId, placementData) => {
  return placementData.jobs.find(j => String(j.id) === String(jobId));
};

// Helper function to get applications for a specific job
export const getApplicationsForJob = (jobId, placementData) => {
  return placementData.applications.filter(a => String(a.jobId) === String(jobId));
};

// Helper function to get applications for a specific student
export const getApplicationsForStudent = (studentId, placementData) => {
  return placementData.applications.filter(a => String(a.studentId) === String(studentId));
};

// Helper function to get jobs posted by a specific employer
export const getJobsByEmployer = (employerId, placementData) => {
  return placementData.jobs.filter(j => String(j.employerId) === String(employerId));
};

// Helper function to calculate statistics for admin/placement officer dashboard
export const calculateStatistics = (placementData) => {
  const users = placementData.users || [];
  const applications = placementData.applications || [];
  const jobs = placementData.jobs || [];

  const totalStudents = users.filter(u => u.role?.toUpperCase() === 'ROLE_STUDENT').length;
  const totalHired = applications.filter(a => ['APPROVED'].includes((a.status || '').toUpperCase())).length;

  const stats = {
    totalUsers: users.length,
    totalStudents,
    totalEmployers: users.filter(u => u.role?.toUpperCase() === 'ROLE_EMPLOYER').length,
    totalJobs: jobs.filter(j => j.status === 'OPEN').length,
    totalApplications: applications.length,
    offersExtended: totalHired,
    placementRate: Math.round((totalHired / Math.max(totalStudents, 1)) * 100)
  };
  return stats;
};

// Helper function to filter jobs based on search criteria
export const filterJobs = (jobs, filters) => {
  return jobs.filter(job => {
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      if (!job.title.toLowerCase().includes(term) &&
          !job.companyName.toLowerCase().includes(term) &&
          !job.location.toLowerCase().includes(term)) {
        return false;
      }
    }

    if (filters.jobType && job.type !== filters.jobType) {
      return false;
    }

    if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }

    if (filters.status && job.status !== filters.status) {
      return false;
    }

    return true;
  });
};
