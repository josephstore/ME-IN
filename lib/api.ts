import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: {
    email: string;
    password: string;
    userType: 'brand' | 'influencer';
    profile: {
      name: string;
      language?: string[];
      timezone?: string;
    };
  }) => api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  logout: () => api.post('/auth/logout'),

  getCurrentUser: () => api.get('/auth/me'),
};

// User API
export const userAPI = {
  updateProfile: (data: Record<string, unknown>) => api.put('/users/profile', data),
  getProfile: () => api.get('/users/profile'),
};

// Campaign API
export const campaignAPI = {
  create: (data: Record<string, unknown>) => api.post('/campaigns', data),
  getAll: (params?: Record<string, unknown>) => api.get('/campaigns', { params }),
  getById: (id: string) => api.get(`/campaigns/${id}`),
  update: (id: string, data: Record<string, unknown>) => api.put(`/campaigns/${id}`, data),
  delete: (id: string) => api.delete(`/campaigns/${id}`),
  apply: (id: string, data: Record<string, unknown>) => api.post(`/campaigns/${id}/apply`, data),
};

// Influencer API
export const influencerAPI = {
  getAll: (params?: Record<string, unknown>) => api.get('/influencers', { params }),
  getById: (id: string) => api.get(`/influencers/${id}`),
  updateProfile: (data: Record<string, unknown>) => api.put('/influencers/profile', data),
  getStats: () => api.get('/influencers/stats'),
};

// Brand API
export const brandAPI = {
  getAll: (params?: Record<string, unknown>) => api.get('/brands', { params }),
  getById: (id: string) => api.get(`/brands/${id}`),
  updateProfile: (data: Record<string, unknown>) => api.put('/brands/profile', data),
  getStats: () => api.get('/brands/stats'),
};

// Matching API
export const matchingAPI = {
  getRecommendations: (params?: Record<string, unknown>) => api.get('/matching/recommendations', { params }),
  applyToCampaign: (campaignId: string, data: Record<string, unknown>) =>
    api.post(`/matching/campaigns/${campaignId}/apply`, data),
  getMatches: () => api.get('/matching/matches'),
};

// Analytics API
export const analyticsAPI = {
  getCampaignAnalytics: (campaignId: string) =>
    api.get(`/analytics/campaigns/${campaignId}`),
  getInfluencerAnalytics: (influencerId: string) =>
    api.get(`/analytics/influencers/${influencerId}`),
  getDashboardStats: () => api.get('/analytics/dashboard'),
};

export default api;
