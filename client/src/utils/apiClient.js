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
  login: (credentials) => mainApi.post('/auth/login', credentials),
  register: (userData) => mainApi.post('/auth/register', userData),
  getProfile: () => mainApi.get('/auth/me'),
  updateProfile: (userData) => mainApi.put('/profile', userData),
};

// Emissions API
export const emissionsApi = {
  getAll: () => mainApi.get('/emissions'),
  getById: (id) => mainApi.get(`/emissions/${id}`),
  create: (data) => mainApi.post('/emissions', data),
  update: (id, data) => mainApi.put(`/emissions/${id}`, data),
  delete: (id) => mainApi.delete(`/emissions/${id}`),
};

// Vehicles API
export const vehiclesApi = {
  getAll: () => mainApi.get('/vehicles'),
  getById: (id) => mainApi.get(`/vehicles/${id}`),
  create: (data) => mainApi.post('/vehicles', data),
  update: (id, data) => mainApi.put(`/vehicles/${id}`, data),
  delete: (id) => mainApi.delete(`/vehicles/${id}`),
};

// Statistics API
export const statisticsApi = {
  getEmissionsByPeriod: (period) => mainApi.get(`/statistics/emissions/${period}`),
  getEmissionsByVehicle: () => mainApi.get('/statistics/emissions/by-vehicle'),
  getEmissionsTrend: () => mainApi.get('/statistics/emissions/trend'),
};

// Community API
export const communityApiService = {
  getPosts: () => mainApi.get('/community/posts'),
  getPostById: (id) => mainApi.get(`/community/posts/${id}`),
  createPost: (data) => mainApi.post('/community/posts', data),
  updatePost: (id, data) => mainApi.put(`/community/posts/${id}`, data),
  deletePost: (id) => mainApi.delete(`/community/posts/${id}`),
  likePost: (id) => mainApi.post(`/community/posts/${id}/like`),
  commentOnPost: (id, data) => mainApi.post(`/community/posts/${id}/comments`, data),
};

// AQI and Weather API
export const environmentApi = {
  getAqi: (location) => mainApi.get(`/aqi?location=${location}`),
  getWeather: (location) => mainApi.get(`/weather?location=${location}`),
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
