# CO2 Emission Tracker

A MERN stack application for tracking and analyzing CO2 emissions.

## Features

- Track CO2 emissions from various sources
- Visualize emission data with interactive charts
- Set reduction goals and monitor progress
- User authentication and profile management
- Data export and reporting capabilities

## Tech Stack

- **MongoDB**: Database for storing emission data and user information
- **Express.js**: Backend framework for API development
- **React.js**: Frontend library for building the user interface
- **Node.js**: Runtime environment for the server
- **Chart.js**: For data visualization
- **JWT**: For authentication

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Setup Instructions

1. Clone the repository
   ```
   git clone https://github.com/Hussainbhanpura/co2-emission.git
   cd co2-emission
   ```

2. Install all dependencies at once
   ```
   npm run install:all
   ```
   
   Or install dependencies separately:
   ```
   # Server dependencies
   cd server
   npm install
   
   # Client dependencies
   cd ../client
   npm install
   
   # Community service dependencies
   cd ../community-service
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   COMMUNITY_SERVICE_URL=http://localhost:5002
   ```

5. Start the development servers
   ```
   # In the server directory
   npm run dev
   
   # In the client directory
   npm start
   ```

## Project Structure

- `/client`: React frontend application
- `/server`: Node.js/Express backend API
- `/server/models`: MongoDB models
- `/server/routes`: API routes
- `/server/controllers`: Route controllers
- `/server/config`: Configuration files

## Deployment

### Railway Deployment

This project is configured for easy deployment on Railway. Follow these steps to deploy:

1. Create a Railway account at [railway.app](https://railway.app/)

2. Install the Railway CLI (optional but recommended)
   ```
   npm i -g @railway/cli
   ```

3. Login to Railway
   ```
   railway login
   ```

4. Initialize your project (from the project root directory)
   ```
   railway init
   ```

5. Set up environment variables in the Railway dashboard:
   - `PORT`: 5000 (or leave empty to let Railway assign a port)
   - `NODE_ENV`: production
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `JWT_EXPIRE`: 30d
   - `COMMUNITY_SERVICE_URL`: URL to your deployed community service

6. Deploy your application
   ```
   railway up
   ```

7. Open your deployed application
   ```
   railway open
   ```

Alternatively, you can connect your GitHub repository to Railway for automatic deployments.

## License

MIT
