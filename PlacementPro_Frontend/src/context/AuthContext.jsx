import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import API from '../api/axios';
import { extractPrimaryRole } from '../utils/auth';

const AuthContext = createContext();

const initialUser = null;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(initialUser);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const clearAuthState = useCallback(() => {
    localStorage.removeItem('placementProUser');
    localStorage.removeItem('placementProToken');
    setUser(null);
    setNotifications([]);
  }, []);

  const normalizeUser = (userData) => {
    if (!userData) return null;
    const role = extractPrimaryRole(userData);
    const profileCompleted = userData.profileCompleted ?? userData.profileComplete ?? false;
    return { ...userData, role, profileCompleted, profileComplete: profileCompleted };
  };

  const parseAuthResponse = (payload) => {
    if (!payload) {
      return { token: null, userData: null };
    }

    if (payload.user) {
      return {
        token: payload.token ?? null,
        userData: payload.user,
      };
    }

    const { token, ...userData } = payload;
    return {
      token: token ?? null,
      userData,
    };
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('placementProUser');
    const storedToken = localStorage.getItem('placementProToken');

    if (storedUser && storedToken) {
      try {
        setUser(normalizeUser(JSON.parse(storedUser)));
      } catch (err) {
        console.error('AuthContext: invalid user JSON', err);
        localStorage.removeItem('placementProUser');
        localStorage.removeItem('placementProToken');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      refreshNotifications();
      return;
    }
    setNotifications([]);
  }, [user?.id]);

  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      const { token, userData: rawUserData } = parseAuthResponse(response.data);
      
      // Validate that we have user data
      if (!rawUserData || Object.keys(rawUserData).length === 0) {
        console.error('Login error: No user data in response');
        return { 
          success: false, 
          message: 'Invalid server response. Please try again.' 
        };
      }
      
      const userData = normalizeUser(rawUserData);
      
      // Validate that we have a role
      if (!userData || !userData.role) {
        console.error('Login error: User has no role assigned');
        return { 
          success: false, 
          message: 'User account is not properly configured. Please contact support.' 
        };
      }
      
      // Store token and user
      if (token) {
        localStorage.setItem('placementProToken', token);
      }
      setUser(userData);
      localStorage.setItem('placementProUser', JSON.stringify(userData));
      
      try {
        const notificationsResponse = await API.get('/notifications');
        setNotifications(notificationsResponse.data || []);
      } catch (notificationError) {
        console.error('Notification bootstrap error:', notificationError);
        setNotifications([]);
      }
      
      return { success: true, role: userData.role };
    } catch (err) {
      console.error('Login error:', err);
      return { 
        success: false, 
        message: err.response?.data?.message || 'Invalid email or password' 
      };
    }
  };

  const register = async (userData) => {
    try {
      // Ensuring the role is the expected Enum string from the syllabus
      const response = await API.post('/auth/register', {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: 'STUDENT'
      });
      return { success: true, message: response.data.message };
    } catch (err) {
      console.error('Registration error:', err);
      return { 
        success: false, 
        message: err.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const updateProfile = async (profileUpdates) => {
    if (!user) return { success: false, message: 'No user logged in' };

    try {
      const response = await API.put(`/users/profile/${user.id}`, profileUpdates);
      const updatedUserData = normalizeUser(response.data);
      
      setUser(updatedUserData);
      localStorage.setItem('placementProUser', JSON.stringify(updatedUserData));
      
      return { success: true, user: updatedUserData };
    } catch (err) {
      console.error('Update profile error:', err);
      return { 
        success: false, 
        message: err.response?.data?.message || 'Update failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (err) {
      console.error('Logout API error:', err);
    }
    clearAuthState();
  };

  const refreshNotifications = useCallback(async () => {
    if (!user) return [];

    setNotificationsLoading(true);
    try {
      const response = await API.get('/notifications');
      const nextNotifications = response.data || [];
      setNotifications(nextNotifications);
      return nextNotifications;
    } catch (err) {
      if (err?.response?.status === 401) {
        clearAuthState();
        return [];
      }
      console.error('Fetch notifications error:', err);
      setNotifications([]);
      return [];
    } finally {
      setNotificationsLoading(false);
    }
  }, [user, clearAuthState]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        notifications,
        notificationsLoading,
        login,
        register,
        logout,
        updateProfile,
        refreshNotifications,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used inside AuthProvider');
  return context;
};
