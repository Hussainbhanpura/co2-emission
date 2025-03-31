/**
 * Environment variables configuration
 * This file centralizes all environment variable access for the application
 */

// API URLs
export const API_BASE_URL = process.env.REACT_APP_API_URL || '';
export const COMMUNITY_SERVICE_URL = process.env.REACT_APP_COMMUNITY_SERVICE_URL || '';

// Feature flags
export const ENABLE_ANALYTICS = process.env.REACT_APP_ENABLE_ANALYTICS === 'true';
export const DEBUG_MODE = process.env.REACT_APP_DEBUG_MODE === 'true';

// Application settings
export const APP_NAME = 'CO2 Emission Tracker';
export const APP_VERSION = process.env.REACT_APP_VERSION || '1.0.0';

// Environment detection
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const IS_TEST = process.env.NODE_ENV === 'test';

// Deployment platform detection
export const IS_NETLIFY = Boolean(
  window.location.hostname.includes('netlify.app') || 
  process.env.REACT_APP_NETLIFY === 'true'
);
