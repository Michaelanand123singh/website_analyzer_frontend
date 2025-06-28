import axios from 'axios';

// Use environment variable if available, else fallback to Render backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://website-analyzer-backend.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 90000, // Increased to 90 seconds for comprehensive analysis
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
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

// Response interceptor for enhanced error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data?.error || error.message);
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request Timeout - Analysis taking longer than expected');
    } else {
      console.error('Network/Unknown Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Enhanced API service
export const apiService = {
  analyzeWebsite: async (url, options = {}) => {
    const payload = {
      url,
      comprehensive: true, // Enable comprehensive analysis
      ...options
    };
    const response = await api.post('/api/analyze', payload);
    return response.data;
  },

  getAnalysis: async (analysisId) => {
    const response = await api.get(`/api/analysis/${analysisId}`);
    return response.data;
  },

  getRecentAnalyses: async (limit = 10) => {
    const response = await api.get('/api/recent', { params: { limit } });
    return response.data;
  },

  getSummaryReport: async (analysisId) => {
    const response = await api.get(`/api/analysis/${analysisId}/summary`);
    return response.data;
  },

  exportAnalysis: async (analysisId, format = 'pdf') => {
    const response = await api.get(`/api/analysis/${analysisId}/export`, {
      params: { format },
      responseType: format === 'pdf' ? 'blob' : 'json'
    });
    return response.data;
  },

  compareAnalyses: async (analysisIds) => {
    const response = await api.post('/api/compare', { analysis_ids: analysisIds });
    return response.data;
  },

  healthCheck: async () => {
    const response = await api.get('/api/health');
    return response.data;
  },

  // New endpoint for getting analysis statistics
  getAnalysisStats: async () => {
    const response = await api.get('/api/stats');
    return response.data;
  }
};

export default api;