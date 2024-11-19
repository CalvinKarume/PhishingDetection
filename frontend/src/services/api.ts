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
    const { data } = await api.post<{ token: string; user: User }>('/api/auth/login', {
      email,
      password
    });
    return data;
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
  }
};

// URL Analysis API calls
export const analysisApi = {
  analyzeUrl: async (url: string) => {
    const { data } = await api.post<AnalysisResult>('/api/analyze', { url });
    return data;
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