const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const proxy = require('express-http-proxy');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const emissionRoutes = require('./routes/emissions');
const userRoutes = require('./routes/users');
const vehicleRoutes = require('./routes/vehicles');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/emissions', emissionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);

// Proxy requests to community service
const COMMUNITY_SERVICE_URL = process.env.COMMUNITY_SERVICE_URL || 'http://localhost:5001';
app.use('/api/community', proxy(COMMUNITY_SERVICE_URL, {
  proxyReqPathResolver: (req) => {
    // Remove /api/community prefix and pass the rest to the community service
    const parts = req.url.split('?');
    const queryString = parts[1] ? `?${parts[1]}` : '';
    const newPath = `/api${parts[0].replace(/^\/api\/community/, '')}${queryString}`;
    console.log(`Proxying request to community service: ${newPath}`);
    return newPath;
  },
  proxyErrorHandler: (err, res, next) => {
    console.error('Proxy error:', err);
    res.status(500).json({
      success: false,
      message: 'Community service error',
    });
  }
}));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Server Error',
  });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
