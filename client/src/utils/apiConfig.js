// API URL configuration

// For local development, these will be empty strings, which means requests will be relative
// to the current domain (which is what we want for local development with proxy)
// For production on Netlify or Railway, these will point to the deployed API URLs
const API_URL = process.env.REACT_APP_API_URL || '';
const COMMUNITY_SERVICE_URL = process.env.REACT_APP_COMMUNITY_SERVICE_URL || '';

export { API_URL, COMMUNITY_SERVICE_URL };
