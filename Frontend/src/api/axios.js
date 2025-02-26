// frontend/src/api/axios.js
import axios from 'axios';

// Create axios instance with default settings
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to inject tokens dynamically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('studentToken') ||
                localStorage.getItem('teacherToken') ||
                localStorage.getItem('adminToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle unauthorized responses
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Clear student token and redirect to login page
      localStorage.removeItem('studentToken');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Add abort controller to requests for better handling of cancellations
api.interceptors.request.use(config => {
  const controller = new AbortController();
  config.signal = controller.signal;
  return config;
});

export default api;
