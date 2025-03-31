# Deploying CO2 Emission Tracker Microservices to Railway

This guide provides step-by-step instructions for deploying your CO2 Emission Tracker's microservices architecture to Railway.

## Prerequisites

- A [Railway](https://railway.app) account
- Your code pushed to a GitHub repository
- MongoDB database (can be hosted on Railway or elsewhere)

## Deployment Steps

### Step 1: Deploy the Main API Server

1. **Log in to Railway** and create a new project
2. **Select "Deploy from GitHub repo"**
3. **Connect your GitHub repository**
4. **Configure the service**:
   - Set the root directory to `/server`
   - Set the start command to `npm start`
   - Add the following environment variables:
     ```
     PORT=5000
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     NODE_ENV=production
     CORS_ORIGIN=https://your-netlify-app.netlify.app
     ```
5. **Deploy the service**
   - Note the URL provided (e.g., `https://co2-emission-api.up.railway.app`)

### Step 2: Deploy the Community Service

1. **In the same Railway project, add a new service**
   - Click "New Service" → "GitHub Repo"
   - Select the same repository
2. **Configure the service**:
   - Set the root directory to `/community-service`
   - Set the start command to `npm start`
   - Add the following environment variables:
     ```
     PORT=5002
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     NODE_ENV=production
     CORS_ORIGIN=https://your-netlify-app.netlify.app
     ```
3. **Deploy the service**
   - Note the URL provided (e.g., `https://co2-emission-community.up.railway.app`)

### Step 3: Set Up MongoDB (if needed)

If you don't already have a MongoDB instance:

1. **Add a MongoDB database to your Railway project**:
   - Click "New Service" → "Database" → "MongoDB"
   - Railway will create a MongoDB instance and provide connection details
2. **Update your environment variables**:
   - Copy the MongoDB connection string from the "Variables" tab
   - Update the `MONGODB_URI` variable in both services

### Step 4: Deploy the Frontend to Netlify

1. **Log in to [Netlify](https://app.netlify.com/)**
2. **Click "New site from Git"**
3. **Connect to your GitHub repository**
4. **Configure build settings**:
   - Build command: `cd client && npm install && npm run build`
   - Publish directory: `client/build`
5. **Add environment variables**:
   - `REACT_APP_API_URL`: Your Railway API URL (e.g., `https://co2-emission-api.up.railway.app/api`)
   - `REACT_APP_COMMUNITY_SERVICE_URL`: Your Railway community service URL (e.g., `https://co2-emission-community.up.railway.app`)
   - `SKIP_PREFLIGHT_CHECK`: true
   - `ESLINT_NO_DEV_ERRORS`: true
   - `DISABLE_ESLINT_PLUGIN`: true
   - `CI`: false

### Step 5: Update CORS Settings

Make sure your backend services accept requests from your Netlify domain:

1. **Update the CORS_ORIGIN environment variable** in both Railway services to match your Netlify domain
   - Example: `CORS_ORIGIN=https://your-app.netlify.app`

## Testing Your Deployment

After deployment, test the following:
1. User authentication (register/login)
2. Dashboard data loading
3. Community features
4. AQI monitoring

## Monitoring and Maintenance

- **Railway Dashboard**: Monitor your services' health, logs, and resource usage
- **Netlify Dashboard**: Monitor your frontend deployment, builds, and domain settings
- **Set up alerts**: Configure alerts for service outages or high resource usage

## Troubleshooting

- **Check Railway logs** if your services are not responding
- **Verify environment variables** are set correctly
- **Ensure CORS is configured properly** to allow communication between frontend and backend
- **Check MongoDB connection** if database operations are failing
