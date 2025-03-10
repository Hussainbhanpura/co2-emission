import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Loader from '../components/Loader';

const Dashboard = () => {
  const { user, loading, logout } = useAuth();
  
  // Show loading state
  if (loading) {
    return <Loader />;
  }
  
  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <div className="container mt-4">
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '10px', 
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2>Welcome, {user.name}!</h2>
          <button 
            className="btn btn-danger" 
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        <p className="mb-4">This is your CO2 Emissions Dashboard. Start tracking your carbon footprint today!</p>
        
        {/* Placeholder for dashboard content */}
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '2rem', 
          borderRadius: '8px',
          border: '1px dashed #ddd'
        }}>
          <p className="text-center">Dashboard content will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
