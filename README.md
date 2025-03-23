# CO2 Emission Tracker

A comprehensive MERN stack application for tracking, analyzing, and visualizing CO2 emissions with integrated air quality monitoring and community features.

![CO2 Emission Tracker](https://via.placeholder.com/800x400?text=CO2+Emission+Tracker)

## 🌟 Features

### Core Features
- **User Authentication & Profile Management**
  - Secure login and registration with JWT
  - Profile customization with avatar generation
  - Role-based access control (user/admin)

### Emission Tracking
- **Vehicle Emission Monitoring**
  - Track emissions from various vehicle types
  - Calculate carbon footprint based on fuel consumption
  - Historical data visualization with interactive charts

### Air Quality Monitoring
- **Real-time AQI Data**
  - Integration with AccuWeather API
  - City-based air quality monitoring
  - Pollution metrics visualization (PM2.5, PM10, O3, etc.)

### Community Engagement
- **Community Forum**
  - Create and share posts about sustainability
  - Comment on community posts
  - Like and interact with content
  - Real-time updates

### Additional Tools
- **Email Notifications**
  - Automated email service using Nodemailer
  - Verification and alert systems
- **Interactive Chatbot**
  - Assistance with application usage
  - Tips for reducing carbon footprint

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **React Router** - Navigation and routing
- **Chart.js** - Data visualization
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **Axios** - API requests
- **React Toastify** - Toast notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service

### Microservices
- **Community Service** - Dedicated service for community features
- **Main API Service** - Core application functionality

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hussainbhanpura/co2-emission.git
   cd co2-emission
   ```

2. **Install all dependencies at once**
   ```bash
   npm run install:all
   ```
   
   Or install dependencies for each service separately:
   ```bash
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

3. **Environment Setup**
   
   Create `.env` files in both the server and community-service directories:

   **Server .env**
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/co2-emission
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   COMMUNITY_SERVICE_URL=http://localhost:5002
   aqicn=your_aqicn_api_key
   ```

   **Community Service .env**
   ```
   PORT=5002
   MONGO_URI=mongodb://localhost:27017/co2-emission-community
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   ```

## 🏃‍♂️ Running the Application

1. **Start all services with a single command**
   ```bash
   npm start
   ```

   This will concurrently start the client, server, and community service.

2. **Or start each service individually**
   ```bash
   # Start the client (React app)
   cd client
   npm start
   
   # Start the server
   cd server
   npm start
   
   # Start the community service
   cd community-service
   npm start
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Main API: http://localhost:5000
   - Community Service: http://localhost:5002

## 🧩 Project Structure

```
co2-emission/
├── client/                 # Frontend React application
│   ├── public/             # Public assets
│   └── src/                # Source files
│       ├── assets/         # Static assets
│       ├── components/     # Reusable components
│       ├── contexts/       # Context providers
│       ├── hooks/          # Custom React hooks
│       ├── lib/            # Utility functions
│       └── pages/          # Application pages
├── server/                 # Main backend API
│   ├── config/             # Configuration files
│   ├── constants/          # Constants and enums
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   └── routes/             # API routes
└── community-service/      # Community microservice
    ├── controllers/        # Community controllers
    ├── middleware/         # Service middleware
    ├── models/             # Community data models
    └── routes/             # Community API routes
```

## 📱 Key Features Walkthrough

### Authentication
- Register with email and password
- Login with credentials
- JWT-based authentication
- Protected routes for authenticated users

### Dashboard
- Overview of personal carbon footprint
- Recent emissions data
- Comparison with previous periods
- Quick access to main features

### Emission Tracking
- Add new emission entries
- Categorize by source (vehicle, household, etc.)
- View historical data
- Export reports

### Air Quality Index (AQI)
- Search for cities to check air quality
- View detailed pollution metrics
- Historical AQI data visualization

### Community Forum
- Create and share sustainability posts
- Engage with community content
- Follow topics of interest

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 📞 Contact

Hussain Bhanpura - [GitHub](https://github.com/Hussainbhanpura)

Project Link: [https://github.com/Hussainbhanpura/co2-emission](https://github.com/Hussainbhanpura/co2-emission)
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
