const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/posts', require('./routes/posts'));
app.use('/comments', require('./routes/comments'));
app.use('/likes', require('./routes/likes'));

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the CO2 Emission Community Service API' });
});

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Community service running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection:', err.message);
  // Close server & exit process
  process.exit(1);
});
