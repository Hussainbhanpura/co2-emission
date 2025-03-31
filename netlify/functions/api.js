const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const vehicleRoutes = require('../../server/routes/vehicles');
const authRoutes = require('../../server/routes/auth');
const aqiRoutes = require('../../server/routes/aqi');
const weatherRoutes = require('../../server/routes/weather');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/co2emissions';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

connectDB();

// API Routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/aqi', aqiRoutes);
app.use('/api/weather', weatherRoutes);

// Proxy route for community service
app.use('/api/community', async (req, res) => {
  try {
    // In a serverless function, we can't directly proxy
    // You would need to make a fetch request to your community service
    const communityServiceUrl = process.env.COMMUNITY_SERVICE_URL || 'https://co2-emission-community.up.railway.app';
    
    // This is a simplified example - you would need to implement proper request forwarding
    res.status(501).json({ 
      success: false, 
      message: 'Community service proxying is not implemented in serverless functions. Please deploy community service separately.' 
    });
  } catch (error) {
    console.error('Error proxying to community service:', error);
    res.status(500).json({ success: false, message: 'Error connecting to community service' });
  }
});

// Export the serverless function
module.exports.handler = serverless(app);
