export const JOB_STATUS = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  DRAFT: 'DRAFT',
};

export const APPLICATION_STATUS = {
  APPLIED: 'APPLIED',
  SHORTLISTED: 'SHORTLISTED',
  INTERVIEWED: 'INTERVIEWED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  REMOVED: 'REMOVED',
};

export const formatStatusLabel = (status) => {
  switch ((status || '').toUpperCase()) {
    case 'OPEN':
      return 'Open';
    case 'CLOSED':
      return 'Closed';
    case 'DRAFT':
      return 'Draft';
    case 'APPLIED':
      return 'Applied';
    case 'SHORTLISTED':
      return 'Shortlisted';
    case 'INTERVIEWED':
      return 'Interviewed';
    case 'APPROVED':
      return 'Approved';
    case 'REJECTED':
      return 'Rejected';
    case 'REMOVED':
      return 'Removed';
    default:
      return status || 'Unknown';
  }
};

export const getJobStatusColor = (status) => {
  switch ((status || '').toUpperCase()) {
    case 'OPEN':
      return 'bg-green-100 text-green-800';
    case 'CLOSED':
      return 'bg-red-100 text-red-800';
    case 'DRAFT':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getApplicationStatusColor = (status) => {
  switch ((status || '').toUpperCase()) {
    case 'APPLIED':
      return 'bg-blue-100 text-blue-800';
    case 'SHORTLISTED':
      return 'bg-yellow-100 text-yellow-800';
    case 'INTERVIEWED':
      return 'bg-green-100 text-green-800';
    case 'APPROVED':
      return 'bg-emerald-100 text-emerald-800';
    case 'REJECTED':
      return 'bg-red-100 text-red-800';
    case 'REMOVED':
      return 'bg-slate-200 text-slate-700';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
