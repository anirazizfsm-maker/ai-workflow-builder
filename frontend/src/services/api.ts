import axios from 'axios';
// import toast from 'react-hot-toast'; // Import in components that need it

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
                     import.meta.env.VITE_API_DEV_URL || 
                     'http://localhost:3001';

// Create axios instance with default configuration
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include credentials for CORS
});

// Request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('lethimdo_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('lethimdo_token');
      window.location.href = '/login';
    }
    
    // Log error for debugging
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    });
    
    return Promise.reject(error);
  }
);

// API endpoint functions
export const apiEndpoints = {
  // Health check
  health: () => api.get('/health'),
  
  // Basic info
  info: () => api.get('/'),
  
  // Authentication
  auth: {
    me: () => api.get('/api/auth/me'),
    login: (credentials: { email: string; password: string }) => 
      api.post('/api/auth/login', credentials),
    register: (userData: { name: string; email: string; password: string }) => 
      api.post('/api/auth/register', userData),
    logout: () => api.post('/api/auth/logout'),
  },
  
  // Integrations
  integrations: {
    list: () => api.get('/api/integrations'),
    connect: (id: string) => api.post(`/api/integrations/${id}/connect`),
    disconnect: (id: string) => api.delete(`/api/integrations/${id}/disconnect`),
    discover: (url: string) => api.post('/api/integrations/discover', { url }),
    marketplace: {
      search: (query?: string) => api.get('/api/integrations/marketplace/search', {
        params: { q: query }
      }),
    },
  },
  
  // Workflows
  workflows: {
    list: () => api.get('/api/workflows'),
    create: (workflow: any) => api.post('/api/workflows', workflow),
    get: (id: string) => api.get(`/api/workflows/${id}`),
    update: (id: string, workflow: any) => api.put(`/api/workflows/${id}`, workflow),
    delete: (id: string) => api.delete(`/api/workflows/${id}`),
    execute: (id: string) => api.post(`/api/workflows/${id}/execute`),
  },
  
  // AI (for future use)
  ai: {
    generateWorkflow: (description: string, businessContext?: string) => 
      api.post('/api/ai/generate-workflow', { description, businessContext }),
  },
  
  // Analytics
  analytics: {
    overview: (period?: string) => api.get('/api/analytics', { params: { period } }),
    timeSavings: (period?: string) => api.get('/api/analytics/time-savings', { params: { period } }),
    costSavings: (period?: string) => api.get('/api/analytics/cost-savings', { params: { period } }),
    workflowPerformance: () => api.get('/api/analytics/workflow-performance'),
    workflowPerformanceById: (workflowId: string) => api.get(`/api/analytics/workflow-performance/${workflowId}`),
  },
  
  // Auto-fix
  autoFix: {
    diagnoseError: (data: { workflowId: string; error: any }) => api.post('/api/ai/diagnose-error', data),
    suggestFix: (data: { workflowId: string; error: any }) => api.post('/api/ai/suggest-fix', data),
    autoRepair: (data: { workflowId: string; error: any }) => api.post('/api/ai/auto-repair', data),
  },
};

// Helper function to check API connectivity
export const checkApiConnection = async () => {
  try {
    const response = await apiEndpoints.health();
    return {
      connected: true,
      status: response.data,
      url: API_BASE_URL,
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      url: API_BASE_URL,
    };
  }
};

// Export API base URL for reference
export { API_BASE_URL };
