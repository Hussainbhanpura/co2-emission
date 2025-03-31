/**
 * API Configuration
 * 
 * This file provides the API URLs for both local development and production.
 * It imports from the centralized environment configuration in env.js.
 */

import { API_BASE_URL, COMMUNITY_SERVICE_URL, IS_NETLIFY } from './env';

/**
 * Get the appropriate API URL based on environment
 * 
 * For local development: empty string (relative URLs)
 * For production: full URLs from environment variables
 */
const getApiUrl = () => {
  // For local development, use relative URLs with the proxy
  if (!API_BASE_URL && IS_NETLIFY) {
    return '/api';
  }
  return API_BASE_URL;
};

/**
 * Get the appropriate community service URL based on environment
 */
const getCommunityServiceUrl = () => {
  // For local development, use relative URLs with the proxy
  if (!COMMUNITY_SERVICE_URL && IS_NETLIFY) {
    return '/api/community';
  }
  return COMMUNITY_SERVICE_URL;
};

// Export the API URLs
export const API_URL = getApiUrl();
export const COMMUNITY_URL = getCommunityServiceUrl();
