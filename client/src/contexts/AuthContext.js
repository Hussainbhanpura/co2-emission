import React, { createContext, useContext, useState, useEffect } from 'react';
// Import centralized API client and error handler
import { authApi } from '../utils/apiClient';
import { handleApiError } from '../utils/errorHandler';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in on page load
    const loadUser = async () => {
      if (token) {
        try {
          // Get user data using the centralized API client
          const res = await authApi.getProfile();
          
          if (res.data.success) {
            setUser(res.data.user);
          } else {
            // Clear localStorage if authentication fails
            localStorage.removeItem('token');
            setToken(null);
            delete axios.defaults.headers.common['Authorization'];
          }
        } catch (err) {
          // Clear localStorage if authentication fails
          localStorage.removeItem('token');
          setToken(null);
          delete axios.defaults.headers.common['Authorization'];
          setError(err.response?.data?.message || 'An error occurred');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use centralized API client
      const res = await authApi.register(userData);
      
      if (res.data.success) {
        // Store token and user data
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
      }
      
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      // Use centralized error handler
      handleApiError(err, setError, 'register');
      throw err;
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use centralized API client
      const res = await authApi.login(userData);
      
      if (res.data.success) {
        // Store token and user data
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
      }
      
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      // Use centralized error handler
      handleApiError(err, setError, 'login');
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Clear errors
  const clearError = () => setError(null);

  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
