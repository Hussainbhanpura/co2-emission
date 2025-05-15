/**
 * API Client
 * 
 * A centralized API client for making HTTP requests to the backend services.
 * This helps maintain consistency in API calls across the application.
 */

import axios from 'axios';
import { API_URL, COMMUNITY_URL } from './apiConfig';

// Create axios instances for main API and community service
const mainApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const communityApi = axios.create({
  baseURL: COMMUNITY_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to all requests
const addAuthToken = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

mainApi.interceptors.request.use(addAuthToken);
communityApi.interceptors.request.use(addAuthToken);

// Response interceptor to handle common errors
const handleResponse = (response) => response;
const handleError = (error) => {
  // Handle common errors (401, 403, 500, etc.)
  if (error.response) {
    // Unauthorized - clear token and redirect to login
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      // You could also use a central event bus to notify the app
      // about authentication failures
    }
  }
  return Promise.reject(error);
};

mainApi.interceptors.response.use(handleResponse, handleError);
communityApi.interceptors.response.use(handleResponse, handleError);

// Auth API
export const authApi = {
  login: (credentials) => mainApi.post('/api/auth/login', credentials),
  register: (userData) => mainApi.post('/api/auth/register', userData),
  getProfile: () => mainApi.get('/api/auth/me'),
  updateProfile: (userData) => mainApi.put('/api/profile', userData),
};

// Emissions API
export const emissionsApi = {
  getAll: () => mainApi.get('/api/emissions'),
  getById: (id) => mainApi.get(`/api/emissions/${id}`),
  create: (data) => mainApi.post('/api/emissions', data),
  update: (id, data) => mainApi.put(`/api/emissions/${id}`, data),
  delete: (id) => mainApi.delete(`/api/emissions/${id}`),
};

// Vehicles API
export const vehiclesApi = {
  getAll: () => mainApi.get('/api/vehicles'),
  getById: (id) => mainApi.get(`/api/vehicles/${id}`),
  create: (data) => mainApi.post('/api/vehicles', data),
  update: (id, data) => mainApi.put(`/api/vehicles/${id}`, data),
  delete: (id) => mainApi.delete(`/api/vehicles/${id}`),
  getExceeding: () => mainApi.get('/api/vehicles/exceeding')
};

// Statistics API
export const statisticsApi = {
  getEmissionsByPeriod: (period) => mainApi.get(`/api/statistics/emissions/${period}`),
  getEmissionsByVehicle: () => mainApi.get('/api/statistics/emissions/by-vehicle'),
  getEmissionsTrend: () => mainApi.get('/api/statistics/emissions/trend'),
  getVehicleStats: () => mainApi.get('/api/statistics/vehicles')
};

// Community API
export const communityApiService = {
  getPosts: () => mainApi.get('/api/community/posts'),
  getPostById: (id) => mainApi.get(`/api/community/posts/${id}`),
  createPost: (data) => mainApi.post('/api/community/posts', data),
  updatePost: (id, data) => mainApi.put(`/api/community/posts/${id}`, data),
  deletePost: (id) => mainApi.delete(`/api/community/posts/${id}`),
  likePost: (id) => mainApi.put(`/api/community/posts/like/${id}`),
  unlikePost: (id) => mainApi.put(`/api/community/posts/unlike/${id}`),
  commentOnPost: (id, data) => mainApi.post(`/api/community/comments/${id}`, data),
  getComments: (postId) => mainApi.get(`/api/community/comments/${postId}`),
  addComment: (postId, content, parentComment = null) => mainApi.post(`/api/community/comments/${postId}`, { content, parentComment }),
  updateComment: (id, content) => mainApi.put(`/api/community/comments/${id}`, { content }),
  deleteComment: (id) => mainApi.delete(`/api/community/comments/${id}`)
};
// /api/likes/post/:postId
// @route   GET /api/likes/comment/:commentId
// AQI and Weather API
export const environmentApi = {
  getAqi: (location) => mainApi.get(`/api/aqi?location=${location}`),
  getWeather: (location) => mainApi.get(`/api/weather?location=${location}`),
};

// Export the raw API instances for advanced use cases
export { mainApi };

// Default export for convenience
export default {
  auth: authApi,
  emissions: emissionsApi,
  vehicles: vehiclesApi,
  statistics: statisticsApi,
  community: communityApiService,
  environment: environmentApi,
};
