import axios from 'axios';
import client from './client';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const login = async (email, password) => {
  const params = new URLSearchParams();
  params.append('username', email);
  params.append('password', password);
  const { data } = await axios.post(`${BASE_URL}/users/login`, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return data;
};

export const register = async (userData) => {
  const { data } = await client.post('/users/register', userData);
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await client.get('/auth/me');
  return data;
};

export const refreshToken = async (token) => {
  const { data } = await client.post('/auth/refresh', { refresh_token: token });
  return data;
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};
