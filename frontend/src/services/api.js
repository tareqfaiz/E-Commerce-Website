import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add token to headers
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

// Response interceptor to handle 401 errors and refresh token
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Import refreshToken and logout dynamically to avoid import errors
        const { refreshToken } = await import('../context/AuthContext');
        const { logout } = await import('../context/AuthContext');
        const refreshed = await refreshToken();
        if (refreshed) {
          const newToken = localStorage.getItem('token');
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return API(originalRequest);
        }
      } catch (refreshError) {
        logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default API;

export async function loginUser(credentials) {
  try {
    const response = await API.post('/auth/login', credentials);
    return { success: true, user: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || error.message };
  }
}

export async function registerUser(data) {
  try {
    const response = await API.post('/auth/register', data);
    return { success: true, user: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || error.message };
  }
}
