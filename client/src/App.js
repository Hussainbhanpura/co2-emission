import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CommunityProvider } from './contexts/CommunityContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CommunityPage from './pages/Community/CommunityPage';
import PostDetail from './pages/Community/PostDetail';
import EditPost from './pages/Community/EditPost';
import VehicleStatistics from './pages/VehicleStatistics';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { Toaster } from './components/ui/toaster';
import { ToastProvider } from './hooks/use-toast';

// Component to conditionally render Navbar
const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  
  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthPage && <Navbar />}
      <main className={isAuthPage ? "" : "pt-4"}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin-only Routes */}
          <Route path="/vehicle-statistics" element={
            <ProtectedAdminRoute>
              <VehicleStatistics />
            </ProtectedAdminRoute>
          } />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community/post/:id" element={<PostDetail />} />
            <Route path="/community/edit/:id" element={<EditPost />} />
            <Route path="/profile" element={<Profile />} />
            {/* Add more protected routes here */}
          </Route>
          
          {/* Redirect to login if no route matches */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CommunityProvider>
        <ToastProvider>
          <Router>
            <AppContent />
            <Toaster />
          </Router>
          <ToastContainer position="top-right" autoClose={5000} />
        </ToastProvider>
      </CommunityProvider>
    </AuthProvider>
  );
}

export default App;
