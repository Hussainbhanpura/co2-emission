/**
 * Error Handler Utility
 * 
 * Centralized error handling for the application
 */

// Standard error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  UNAUTHORIZED: 'You are not authorized. Please log in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An unexpected server error occurred. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  DEFAULT: 'Something went wrong. Please try again.'
};

/**
 * Format error message from API response
 * @param {Error} error - Axios error object
 * @returns {string} Formatted error message
 */
export const getErrorMessage = (error) => {
  if (!error.response) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  const { status, data } = error.response;

  // Handle specific status codes
  switch (status) {
    case 400:
      return data.message || ERROR_MESSAGES.VALIDATION_ERROR;
    case 401:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case 403:
      return ERROR_MESSAGES.FORBIDDEN;
    case 404:
      return ERROR_MESSAGES.NOT_FOUND;
    case 500:
      return ERROR_MESSAGES.SERVER_ERROR;
    default:
      return data.message || ERROR_MESSAGES.DEFAULT;
  }
};

/**
 * Log error to console in development mode
 * @param {Error} error - Error object
 * @param {string} context - Context where the error occurred
 */
export const logError = (error, context = '') => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(`Error in ${context}:`, error);
  }
  
  // In production, you could send errors to a monitoring service like Sentry
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(error);
  // }
};

/**
 * Handle API error with consistent approach
 * @param {Error} error - Axios error object
 * @param {Function} setError - State setter for error message
 * @param {string} context - Context where the error occurred
 * @returns {string} Formatted error message
 */
export const handleApiError = (error, setError, context = '') => {
  const message = getErrorMessage(error);
  
  // Log the error
  logError(error, context);
  
  // Update state if setError function is provided
  if (setError && typeof setError === 'function') {
    setError(message);
  }
  
  return message;
};

export default {
  getErrorMessage,
  handleApiError,
  logError,
  ERROR_MESSAGES
};
