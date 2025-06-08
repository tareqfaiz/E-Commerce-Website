import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000', // Adjust backend URL as needed
});

// Add a request interceptor to include token in headers
API.interceptors.request.use(
  (config) => {
    // Do not add token for login routes
    if (config.url === '/auth/login' || config.url === '/auth/admin/login') {
      return config;
    }
    // Add admin token for admin routes
    if (config.url && config.url.startsWith('/auth/admin')) {
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      }
      return config;
    }
    // Add user token for other routes
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// User login
export const loginUser = (data) => API.post('/auth/login', data);

// Admin login
export const adminLogin = (data) => API.post('/auth/admin/login', data);

// Other API calls...

export default API;
