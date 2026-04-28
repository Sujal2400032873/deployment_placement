import { useState, useEffect } from 'react';

// Custom hook to manage authentication state using localStorage
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('placementProUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('placementProUser');
      }
    }
    setLoading(false);
  }, []);

  // Login function - validates credentials against users in placementProData
  const login = (email, password) => {
    try {
      const data = JSON.parse(localStorage.getItem('placementProData') || '{}');
      const users = data.users || [];

      // Find user with matching email and password
      const foundUser = users.find(u => u.email === email && u.password === password);

      if (foundUser) {
        const userToStore = {
          id: foundUser.id,
          email: foundUser.email,
          role: foundUser.role,
          name: foundUser.name,
          profile: foundUser.profile
        };
        setUser(userToStore);
        localStorage.setItem('placementProUser', JSON.stringify(userToStore));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Register function - creates new user and stores in placementProData
  const register = (email, password, name, role) => {
    try {
      const data = JSON.parse(localStorage.getItem('placementProData') || '{"users":[],"jobs":[],"applications":[]}');

      // Check if email already exists
      if (data.users.some(u => u.email === email)) {
        return false;
      }

      // Create new user object
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        password, // In production, this should be hashed on backend
        role,
        name,
        profile: role === 'employer' ? { companyName: '' } : { skills: [], phone: '', department: '', resumeUrl: '' },
        createdAt: new Date().toISOString()
      };

      // Add user to data
      data.users.push(newUser);
      localStorage.setItem('placementProData', JSON.stringify(data));

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  // Logout function - clears user from localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('placementProUser');
  };

  return { user, loading, login, register, logout };
};
