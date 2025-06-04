import axios from 'axios';

const API_BASE_URL = 'https://fakestoreapi.com';

const API = axios.create({
  baseURL: API_BASE_URL,
});

export default API;

export async function loginUser(credentials) {
  // Fake Store API does not support login, so simulate success
  return { success: true, user: { email: credentials.email } };
}

export async function registerUser(data) {
  // Fake Store API does not support registration, so simulate success
  return { success: true, user: { email: data.email } };
}
