import axios from 'axios';
import { getToken } from './authService';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://mi-backend-saas.onrender.com',
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Muestra el error real del backend en consola
      console.error('API error:', error.response.status, error.response.data);
    } else {
      console.error('API error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api; 