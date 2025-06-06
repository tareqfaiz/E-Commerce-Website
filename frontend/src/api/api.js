import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000', // Adjust backend URL as needed
});

// Add a request interceptor to include token in headers
API.interceptors.request.use(
  (config) => {
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
