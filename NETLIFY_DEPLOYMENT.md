# Deploying CO2 Emission Tracker to Netlify

This guide explains how to deploy the CO2 Emission Tracker application to Netlify, including both the frontend and backend components.

## Deployment Options

You have two main options for deployment:

1. **Frontend-only on Netlify + Backend on Railway** (Recommended)
2. **Full-stack deployment on Netlify** (Using Netlify Functions)

## Option 1: Frontend on Netlify + Backend on Railway (Recommended)

This is the recommended approach as it leverages Railway's strength in hosting Node.js applications and databases.

### Step 1: Deploy Backend to Railway

1. Push your code to GitHub
2. Connect your GitHub repository to Railway
3. Configure the following environment variables in Railway:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Secret for JWT token generation
   - `PORT`: 5000 (or your preferred port)

### Step 2: Deploy Frontend to Netlify

1. Log in to [Netlify](https://app.netlify.com/)
2. Click "New site from Git"
3. Connect to your GitHub repository
4. Configure build settings:
   - Build command: `cd client && npm install && npm run build`
   - Publish directory: `client/build`
5. Add environment variables:
   - `REACT_APP_API_URL`: Your Railway backend URL (e.g., `https://co2-emission-api.up.railway.app/api`)
   - `REACT_APP_COMMUNITY_SERVICE_URL`: Your Railway community service URL
   - `SKIP_PREFLIGHT_CHECK`: true
   - `ESLINT_NO_DEV_ERRORS`: true
   - `DISABLE_ESLINT_PLUGIN`: true
   - `CI`: false

## Option 2: Full-stack Deployment on Netlify

This approach uses Netlify Functions to host both frontend and backend.

### Step 1: Configure for Netlify Functions

The repository has already been configured with:
- Serverless function files in `/netlify/functions/`
- Redirect rules in `netlify.toml`
- Updated API configuration in the frontend

### Step 2: Deploy to Netlify

1. Log in to [Netlify](https://app.netlify.com/)
2. Click "New site from Git"
3. Connect to your GitHub repository
4. Netlify will automatically detect the configuration from `netlify.toml`
5. Add environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Secret for JWT token generation
   - `SKIP_PREFLIGHT_CHECK`: true
   - `ESLINT_NO_DEV_ERRORS`: true
   - `DISABLE_ESLINT_PLUGIN`: true
   - `CI`: false

### Step 3: Test the Deployment

After deployment, test the following:
1. User authentication (register/login)
2. Dashboard data loading
3. Community features
4. AQI monitoring

## Limitations of Netlify Functions

When using Netlify Functions (Option 2), be aware of these limitations:

1. **Execution Time**: Functions have a 10-second timeout limit
2. **Cold Starts**: First request may be slower due to function initialization
3. **Statelessness**: Functions are stateless and can't maintain persistent connections
4. **Database Connections**: Each function invocation creates a new database connection

For a production application with significant traffic, Option 1 (Frontend on Netlify + Backend on Railway) is recommended.

## Local Development with Netlify Functions

To test Netlify Functions locally:

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Run: `netlify dev`

This will start a local development server that simulates the Netlify environment.
