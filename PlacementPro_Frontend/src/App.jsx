import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import PlacementOfficerDashboard from './pages/PlacementOfficerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminProfile from './pages/AdminProfile';
import ProfilePage from './pages/ProfilePage';
import JobsPage from './pages/JobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import ApplicationsPage from './pages/ApplicationsPage';
import NotificationsPage from './pages/NotificationsPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import Toast from './components/Toast';
import { AuthProvider } from './context/AuthContext';
import { PlacementDataProvider } from './context/PlacementDataContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';

const AppContent = () => {
  const { toast, clearToast } = useToast();

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="pricing" element={<PricingPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="jobs/:jobId" element={<JobDetailsPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="profile" element={<ProfilePage />} />
              <Route path="notifications" element={<NotificationsPage />} />
            </Route>

            <Route element={<ProtectedRoute requiredRole="ROLE_STUDENT" />}>
              <Route path="applications" element={<ApplicationsPage />} />
              <Route path="student/dashboard" element={<StudentDashboard />} />
            </Route>

            <Route element={<ProtectedRoute requiredRole="ROLE_EMPLOYER" />}>
              <Route path="employer/dashboard" element={<EmployerDashboard />} />
            </Route>

            <Route element={<ProtectedRoute requiredRole="ROLE_PLACEMENT_OFFICER" />}>
              <Route path="placement/dashboard" element={<PlacementOfficerDashboard />} />
            </Route>

            <Route element={<ProtectedRoute requiredRole="ROLE_ADMIN" />}>
              <Route path="admin/dashboard" element={<AdminDashboard />} />
              <Route path="admin/profile" element={<AdminProfile />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PlacementDataProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </PlacementDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
