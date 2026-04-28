import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Modal from './Modal';
import Button from './Button';
import { useAuthContext } from '../context/AuthContext';
import { hasRole, isProfileComplete } from '../utils/auth';

const Layout = () => {
  const { user } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  const shouldBlockForProfile = Boolean(
    user &&
    !hasRole(user, 'ROLE_ADMIN') &&
    !isProfileComplete(user) &&
    location.pathname !== '/profile'
  );

  useEffect(() => {
    if (shouldBlockForProfile) {
      navigate('/profile', { replace: true });
    }
  }, [navigate, shouldBlockForProfile]);

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top,_rgba(49,130,206,0.08),_transparent_45%)_0_0,_radial-gradient(circle_at_bottom,_rgba(129,140,248,0.08),_transparent_45%)_0_100%] dark:bg-[radial-gradient(circle_at_top,_rgba(49,130,206,0.1),_transparent_45%)_0_0,_radial-gradient(circle_at_bottom,_rgba(129,140,248,0.05),_transparent_45%)_0_100%] text-gray-800 dark:text-gray-100 transition-colors duration-200">
      <Navbar />
      <main className="flex-1 w-full overflow-x-hidden fade-page">
        <Outlet />
      </main>
      <Footer />
      <Modal
        isOpen={shouldBlockForProfile}
        onClose={() => navigate('/profile', { replace: true })}
        title="Complete Your Profile"
        closeButton={false}
        footer={
          <Button onClick={() => navigate('/profile', { replace: true })}>
            Go to Profile
          </Button>
        }
      >
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Your profile must be completed before you can access the dashboard.
        </p>
      </Modal>
    </div>
  );
};

export default Layout;
