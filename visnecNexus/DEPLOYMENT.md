# VNX Nexus Deployment Guide

This guide explains how to deploy the VNX Nexus application using Vercel for the frontend and Railway for the backend.

## Project Structure Overview

The project is organized into two separate deployable parts:

- **Frontend**: React application (deploy to Vercel)
- **Backend**: Express API server (deploy to Railway)

## Backend Deployment (Railway)

### 1. Prepare Backend Repository

Create a new GitHub repository for the backend:

```bash
cd backend
git init
git add .
git commit -m "Initial backend commit"
git remote add origin https://github.com/yourusername/vnx-backend.git
git push -u origin main
```

### 2. Deploy to Railway

1. Go to [Railway.app](https://railway.app) and sign in
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your backend repository
4. Railway will automatically detect the Node.js project
5. Add the following environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SESSION_SECRET`: A secure random string for sessions
   - `FRONTEND_URL`: Your Vercel app URL (e.g., https://vnx-nexus.vercel.app)
   - `NODE_ENV`: production

### 3. Configure Domain

After deployment, Railway will provide a URL like `https://your-app.railway.app`. Note this URL for the frontend configuration.

## Frontend Deployment (Vercel)

### 1. Prepare Frontend Repository

Create a new GitHub repository for the frontend:

```bash
cd frontend
git init
git add .
git commit -m "Initial frontend commit"
git remote add origin https://github.com/yourusername/vnx-frontend.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel.com](https://vercel.com) and sign in
2. Click "New Project" → "Import Git Repository"
3. Select your frontend repository
4. Configure the build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Root Directory**: Leave empty (or `./` if needed)

### 3. Environment Variables

Add the following environment variable in Vercel:
- `VITE_API_URL`: Your Railway backend URL (e.g., https://your-app.railway.app)

### 4. Update Backend URL

After getting your Railway URL, update the `vercel.json` file:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-actual-railway-url.railway.app/api/$1"
    }
  ]
}
```

## Local Development

For local development, you can still use the original structure:

```bash
# Start the full-stack development server
npm run dev
```

This runs both frontend and backend together on port 5000.

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://localhost:5432/vnx
PORT=3001
NODE_ENV=development
SESSION_SECRET=your-session-secret-here
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001
```

## Post-Deployment Steps

1. Update the `FRONTEND_URL` in Railway with your actual Vercel URL
2. Update the `VITE_API_URL` in Vercel with your actual Railway URL
3. Test the deployed application
4. Set up your PostgreSQL database (Railway provides this as an add-on)

## Database Setup

Railway offers PostgreSQL as an add-on:

1. In your Railway project, click "Add Service" → "Database" → "PostgreSQL"
2. Copy the provided `DATABASE_URL` and add it to your environment variables
3. The database will be automatically provisioned and connected

## Troubleshooting

- **CORS Issues**: Ensure `FRONTEND_URL` is correctly set in Railway
- **API Not Found**: Verify the `VITE_API_URL` in Vercel matches your Railway URL
- **Build Failures**: Check that all dependencies are properly listed in package.json
- **Database Connection**: Ensure `DATABASE_URL` is properly formatted and accessible

## Support

For deployment issues:
- Railway: Check Railway docs and Discord community
- Vercel: Check Vercel docs and GitHub discussions