// services/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // or your backend URL
});

// Add request interceptor to include the token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // or your token storage method
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;