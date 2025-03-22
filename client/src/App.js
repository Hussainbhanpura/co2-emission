import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CommunityProvider } from './contexts/CommunityContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CommunityPage from './pages/Community/CommunityPage';
import PostDetail from './pages/Community/PostDetail';
import EditPost from './pages/Community/EditPost';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CommunityProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/community/post/:id" element={<PostDetail />} />
              <Route path="/community/edit/:id" element={<EditPost />} />
              {/* Add more protected routes here */}
            </Route>
            
            {/* Redirect to login if no route matches */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
        <ToastContainer position="top-right" autoClose={5000} />
      </CommunityProvider>
    </AuthProvider>
  );
}

export default App;
