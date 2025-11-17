
import axios from 'axios';
import { getToken } from './auth';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Add token to all requests (from localStorage, not env)
axios.interceptors.request.use(
  config => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Handle errors
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/';
    }
    
    return Promise.reject(error);
  }
);

export const getStats = async () => {
  const response = await axios.get(`${API_BASE}/stats`);
  return response.data;
};

export const getPhoneNumbers = async () => {
  const response = await axios.get(`${API_BASE}/phone-numbers`);
  return response.data;
};

export const addPhoneNumber = async (data) => {
  const response = await axios.post(`${API_BASE}/phone-numbers`, data);
  return response.data;
};

export const addPhoneNumbersBulk = async (phoneNumbers) => {
  const response = await axios.post(`${API_BASE}/phone-numbers/bulk`, { phoneNumbers });
  return response.data;
};

export const updatePhoneNumber = async (id, data) => {
  const response = await axios.put(`${API_BASE}/phone-numbers/${id}`, data);
  return response.data;
};

export const deletePhoneNumber = async (id) => {
  const response = await axios.delete(`${API_BASE}/phone-numbers/${id}`);
  return response.data;
};