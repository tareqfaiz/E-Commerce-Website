import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const API = axios.create({
  baseURL: API_BASE_URL,
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

// User registration
export async function registerUser(data) {
  try {
    const response = await API.post('/auth/register', data);
    return { success: true, user: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || error.message };
  }
}

export const requestPasswordReset = (data) => API.post('/password-reset/forgot-password', data);

export const resetPassword = (token, data) => API.post(`/password-reset/reset-password/${token}`, data);

export default API;
