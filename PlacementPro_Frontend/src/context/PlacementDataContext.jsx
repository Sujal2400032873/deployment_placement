import React, { createContext, useContext, useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuthContext } from './AuthContext';
import { hasRole } from '../utils/auth';

const PlacementDataContext = createContext();

export const PlacementDataProvider = ({ children }) => {
  const { user, logout } = useAuthContext();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const isNotFound = (error) => error?.response?.status === 404;

  const fetchJobs = async () => {
    try {
      const endpoint = user && hasRole(user, 'ROLE_EMPLOYER')
        ? `/jobs/employer/${user.id}`
        : '/jobs';
      const response = await API.get(endpoint);
      setJobs(response.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  const fetchUsers = async () => {
    if (!user || !hasRole(user, 'ROLE_ADMIN')) return;
    try {
      const response = await API.get('/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchApplications = async () => {
    if (!user) return;
    try {
      if (hasRole(user, 'ROLE_STUDENT')) {
        const response = await API.get(`/applications/student/${user.id}`);
        setApplications(response.data);
      } else if (hasRole(user, 'ROLE_EMPLOYER')) {
        try {
          const response = await API.get('/employer/applications');
          setApplications(response.data);
        } catch (err) {
          if (!isNotFound(err)) {
            throw err;
          }
          const fallbackResponse = await API.get(`/applications/employer/${user.id}`);
          setApplications(fallbackResponse.data);
        }
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([fetchJobs(), fetchApplications(), fetchUsers()]);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, [user]);

  const applyToJob = async (jobId, applicationData = {}) => {
    if (!user) return { success: false, message: 'Must be logged in' };
    try {
      await API.post('/applications', { jobId, ...applicationData });
      await fetchApplications();
      await fetchJobs();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Application failed' };
    }
  };

  const postJob = async (jobData) => {
    if (!user) return { success: false, message: 'Must be logged in' };
    try {
      await API.post('/jobs', { ...jobData, employerId: user.id });
      await fetchJobs();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Job posting failed' };
    }
  };

  const updateJob = async (jobId, jobData) => {
    if (!user) return { success: false, message: 'Must be logged in' };
    try {
      await API.put(`/jobs/${jobId}`, { ...jobData, employerId: user.id });
      await fetchJobs();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Job update failed' };
    }
  };

  const deleteJob = async (jobId) => {
    if (!user) return { success: false, message: 'Must be logged in' };
    try {
      await API.delete(`/jobs/${jobId}`);
      await refreshData();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Job deletion failed' };
    }
  };

  const deleteUser = async (userId) => {
    if (!user || !hasRole(user, 'ROLE_ADMIN')) return { success: false, message: 'Permission denied' };
    try {
      await API.delete(`/users/${userId}`);
      await refreshData();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'User deletion failed' };
    }
  };

  const assignUserRole = async (userId, role) => {
    if (!user || !hasRole(user, 'ROLE_ADMIN')) return { success: false, message: 'Permission denied' };
    try {
      await API.patch(`/users/${userId}/role`, { role });
      await refreshData();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Role update failed' };
    }
  };

  const createUser = async (userData) => {
    if (!user || !hasRole(user, 'ROLE_ADMIN')) return { success: false, message: 'Permission denied' };
    try {
      const normalizedRole = (userData.role || '').toUpperCase().replace(/^ROLE_/, '');
      // Re-using the admin create-user endpoint for consistency
      await API.post('/users', {
        ...userData,
        role: normalizedRole
      });
      await refreshData();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'User creation failed' };
    }
  };

  const updateApplicationStatus = async (appId, status) => {
    try {
      await API.put(`/employer/application/${appId}/status`, { status });
      await refreshData();
      return { success: true };
    } catch (err) {
      if (isNotFound(err)) {
        try {
          await API.put(`/applications/employer/application/${appId}/status`, { status });
          await refreshData();
          return { success: true };
        } catch (fallbackErr) {
          return { success: false, message: fallbackErr.response?.data?.message || 'Update failed' };
        }
      }
      return { success: false, message: err.response?.data?.message || 'Update failed' };
    }
  };

  return (
    <PlacementDataContext.Provider value={{ 
      jobs, 
      applications, 
      users,
      loading, 
      refreshData, 
      applyToJob, 
      postJob,
      updateJob,
      deleteJob,
      deleteUser,
      assignUserRole,
      createUser,
      updateApplicationStatus,
      placementData: { jobs, applications, users } // For backward compatibility if needed
    }}>
      {children}
    </PlacementDataContext.Provider>
  );
};

export const usePlacementData = () => {
  const context = useContext(PlacementDataContext);
  if (!context) throw new Error('usePlacementData must be used inside PlacementDataProvider');
  return context;
};
