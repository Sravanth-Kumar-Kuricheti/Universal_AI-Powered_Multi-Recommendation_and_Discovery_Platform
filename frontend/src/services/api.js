import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://multi-recommendation-and-discovery.onrender.com/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('API Response error intercepted:', error?.response?.status, error?.message);
    return Promise.reject(error);
  }
);

export default api;
