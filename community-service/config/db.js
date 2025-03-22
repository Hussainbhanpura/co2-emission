const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use environment variable for MongoDB URI or a default for local development
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/co2-community';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
