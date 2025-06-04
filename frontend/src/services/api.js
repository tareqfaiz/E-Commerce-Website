import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: API_BASE_URL,
});

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
