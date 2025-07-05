import axios from 'axios';
import { getToken } from './authService';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://mi-backend-saas.onrender.com/api/',
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api; 