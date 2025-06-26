import axios from 'axios';

// Use environment variable if available, else fallback to Render backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://website-analyzer-backend.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds for analysis
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // explicitly disable credentials for CORS clarity
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.message);
    } else {
      console.error('Network/Unknown Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API service with corrected routes
export const apiService = {
  analyzeWebsite: async (url) => {
    const response = await api.post('/api/analyze', { url });
    return response.data;
  },

  getAnalysis: async (analysisId) => {
    const response = await api.get(`/api/analysis/${analysisId}`);
    return response.data;
  },

  getRecentAnalyses: async () => {
    const response = await api.get('/api/recent');
    return response.data;
  },

  healthCheck: async () => {
    const response = await api.get('/api/health');
    return response.data;
  }
};

export default api;
