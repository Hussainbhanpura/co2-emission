const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import models and routes from community service
const postRoutes = require('../../community-service/routes/posts');
const commentRoutes = require('../../community-service/routes/comments');

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
    console.log('Community service MongoDB connected successfully');
  } catch (err) {
    console.error('Community service MongoDB connection error:', err.message);
    process.exit(1);
  }
};

connectDB();

// API Routes
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);

// Export the serverless function
module.exports.handler = serverless(app);
