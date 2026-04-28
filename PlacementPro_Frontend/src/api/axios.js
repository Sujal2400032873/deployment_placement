import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
});

// Request interceptor to add JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('placementProToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if on a protected page (not login/register)
      const currentPath = window.location.pathname;
      const isPublicPage = ['/login', '/register', '/'].includes(currentPath);
      
      if (!isPublicPage) {
        console.warn('Unauthorized access - redirecting to login');
        localStorage.removeItem('placementProToken');
        localStorage.removeItem('placementProUser');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
