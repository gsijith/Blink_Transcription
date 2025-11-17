
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const TOKEN_KEY = 'auth_token';

export const login = async (username, password) => {
  const response = await axios.post(`${API_BASE}/auth/login`, {
    username,
    password
  });
  
  if (response.data.success && response.data.token) {
    // Store token in localStorage
    localStorage.setItem(TOKEN_KEY, response.data.token);
  }
  
  return response.data;
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getToken();
};