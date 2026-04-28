import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { dashboardRouteForRole, hasRole } from '../utils/auth';

const ProtectedRoute = ({ requiredRole }) => {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  if (loading) return <div className="text-center py-20">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredRole && !hasRole(user, requiredRole)) {
    return <Navigate to={dashboardRouteForRole(user.role)} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
