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

2. Install server dependencies
   ```
   cd server
   npm install
   ```

3. Install client dependencies
   ```
   cd ../client
   npm install
   ```

4. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
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

## License

MIT
# Test update
