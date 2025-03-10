import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loader from './Loader';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Show loading state
  if (loading) {
    return <Loader />;
  }
  
  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // If user is authenticated, render the child route
  return <Outlet />;
};

export default ProtectedRoute;
