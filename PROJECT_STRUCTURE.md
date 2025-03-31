# CO2 Emission Tracker Project Structure

This document outlines the organization of the CO2 Emission Tracker project, which follows a microservices architecture.

## Overview

The project is organized into three main components:

1. **Client** - React frontend application
2. **Server** - Main API server
3. **Community Service** - Microservice for community features

## Directory Structure

```
co2-emission/
├── client/                  # Frontend React application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── assets/          # Images, icons, and other static assets
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── utils/           # Utility functions and helpers
│   │   │   ├── apiClient.js # Centralized API client
│   │   │   ├── apiConfig.js # API configuration
│   │   │   ├── env.js       # Environment variables
│   │   │   └── errorHandler.js # Error handling utilities
│   │   ├── App.js           # Main application component
│   │   └── index.js         # Application entry point
│   ├── .env.production      # Production environment variables
│   └── setupProxy.js        # Development proxy configuration
│
├── server/                  # Main API server
│   ├── config/              # Server configuration
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Express middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   ├── .env.railway         # Railway deployment environment variables
│   ├── Procfile             # Railway deployment configuration
│   └── server.js            # Server entry point
│
├── community-service/       # Community microservice
│   ├── config/              # Service configuration
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Express middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   ├── .env.railway         # Railway deployment environment variables
│   ├── Procfile             # Railway deployment configuration
│   └── server.js            # Service entry point
│

│
├── .gitignore               # Git ignore file
├── package.json             # Root package.json for scripts and dependencies
├── NETLIFY_DEPLOYMENT.md    # Netlify deployment guide
├── PROJECT_STRUCTURE.md     # This file
├── RAILWAY_DEPLOYMENT.md    # Railway deployment guide
└── README.md                # Project overview and documentation
```

## Key Architecture Decisions

### Microservices

The application uses a microservices architecture with:
- **Main API Server**: Handles authentication, emissions tracking, and core features
- **Community Service**: Manages community posts, comments, and interactions

### Frontend Structure

The React frontend follows a modular structure:
- **Contexts**: For global state management (AuthContext, CommunityContext, etc.)
- **Components**: Reusable UI components
- **Pages**: Top-level page components
- **Utils**: Centralized utilities including API client, error handling, and configuration

### API Organization

- **Centralized API Client**: All API calls are made through a single client in `apiClient.js`
- **Error Handling**: Consistent error handling through `errorHandler.js`
- **Environment Configuration**: Environment variables are managed in `env.js`

### Deployment

The application is configured for deployment on:
- **Railway**: Backend services (main API and community service)
- **Netlify**: Frontend application (client directory)

## Development Workflow

1. Run the entire application with `npm start` from the root directory
2. This starts all three services concurrently:
   - Client on port 3000
   - Main API server on port 5000
   - Community service on port 5002

## API Structure

### Main API Server Endpoints

- `/api/auth/*` - Authentication endpoints
- `/api/emissions/*` - Emissions tracking
- `/api/vehicles/*` - Vehicle management
- `/api/statistics/*` - Emissions statistics
- `/api/profile/*` - User profile management
- `/api/aqi/*` - Air quality data
- `/api/weather/*` - Weather data

### Community Service Endpoints

- `/api/community/posts/*` - Community posts
- `/api/community/comments/*` - Post comments
