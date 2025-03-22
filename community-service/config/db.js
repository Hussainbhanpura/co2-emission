const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use environment variable for MongoDB URI or a default for local development
    const mongoURI = process.env.MONGODB_URI;
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
