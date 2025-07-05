import axios from 'axios';

const API_URL = (process.env.REACT_APP_API_URL || 'https://mi-backend-saas.onrender.com/api') + '/auth/login-json';

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const response = await axios.post(API_URL, {
    username,
    password,
  });
  return response.data;
}

export function saveToken(token: string) {
  localStorage.setItem('token', token);
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function removeToken() {
  localStorage.removeItem('token');
} 