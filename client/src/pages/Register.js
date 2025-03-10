import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaLeaf } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const { register, error, clearError, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Show error message if there's an error
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Create CO2 bubbles animation
  useEffect(() => {
    const container = document.querySelector('.auth-container');
    const createBubble = () => {
      const bubble = document.createElement('div');
      bubble.classList.add('bubble');
      
      // Random size between 10px and 30px
      const size = Math.random() * 20 + 10;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      
      // Random horizontal position
      const left = Math.random() * 100;
      bubble.style.left = `${left}%`;
      
      // Random animation duration
      const duration = Math.random() * 5 + 5;
      bubble.style.setProperty('--duration', `${duration}s`);
      
      container.appendChild(bubble);
      
      // Remove bubble after animation completes
      setTimeout(() => {
        bubble.remove();
      }, duration * 1000);
    };
    
    // Create bubbles at intervals
    const interval = setInterval(createBubble, 500);
    
    // Cleanup
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Clear password error when user types in either password field
    if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Send only the required fields to register
      const { name, email, password } = formData;
      await register({ name, email, password });
      toast.success('Registration successful!');
      // Navigation will happen automatically due to the useEffect
    } catch (err) {
      // Error is handled by the useEffect that watches the error state
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Decorative leaf elements */}
      <FaLeaf className="leaf-icon leaf-1" />
      <FaLeaf className="leaf-icon leaf-2" />
      <FaLeaf className="leaf-icon leaf-3" />
      <FaLeaf className="leaf-icon leaf-4" />

      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join us in tracking your carbon footprint</p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="input-field"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
            <FaUser className="input-icon" />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="input-field"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
            />
            <FaEnvelope className="input-icon" />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="input-field"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              minLength="6"
            />
            <FaLock className="input-icon" />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="input-field"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="••••••••"
              minLength="6"
            />
            <FaLock className="input-icon" />
            {passwordError && <div className="error-message">{passwordError}</div>}
          </div>
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Log in
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default Register;
