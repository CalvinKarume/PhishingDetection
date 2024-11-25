import axios from 'axios';
import env from '../config/env';
import { AnalysisResult, User } from '../types';

// Create axios instance with default config
const api = axios.create({
  baseURL: env.API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('Making request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Response error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return Promise.reject(error);
  }
);

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authApi = {
  login: async (email: string, password: string) => {
    try {
      console.log('API: Making login request'); // Debug log
      const response = await api.post('/api/auth/login', {
        email,
        password
      });
      console.log('API: Login response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('API: Login error:', error); // Debug log
      throw error;
    }
  },

  register: async (email: string, password: string) => {
    try {
      console.log('Attempting registration with:', { email });
      const response = await api.post<{ token: string; user: User }>('/api/auth/register', {
        email,
        password
      });
      console.log('Registration successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get<{ user: User }>('/api/auth/profile');
      return response.data;
    } catch (error) {
      console.error('API: Get profile error:', error);
      throw error;
    }
  }
};

// URL Analysis API calls
export const analysisApi = {
  analyzeUrl: async (url: string, token: string) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/analysis/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ url }),
    });
    return response.json();
  },

  getHistory: async () => {
    const { data } = await api.get<AnalysisResult[]>('/api/history');
    return data;
  },

  getAnalysis: async (id: string) => {
    const { data } = await api.get<AnalysisResult>(`/api/analysis/${id}`);
    return data;
  }
};

export default api;