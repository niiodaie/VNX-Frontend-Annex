# VNX Nexus - Digital Innovation Hub

A modern, responsive web application built with React and Express, featuring 8 core platform pillars for digital innovation.

## Project Structure

```
vnx-nexus/
├── frontend/                 # React frontend (deploy to Vercel)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── lib/
│   ├── package.json
│   ├── vite.config.ts
│   ├── vercel.json
│   └── .env.example
├── backend/                  # Express backend (deploy to Railway)
│   ├── server/
│   ├── shared/
│   ├── package.json
│   ├── railway.toml
│   ├── drizzle.config.ts
│   └── .env.example
└── README.md
```

## Platform Pillars

1. **Tools** - Handy utilities that solve real-world problems
2. **Platforms** - Interactive launchpads and service layers
3. **Directories** - Discover niche resources by category
4. **Resources** - Templates, guides, and downloadable kits
5. **Community** - Peer collaboration and feedback forums
6. **Marketplace** - Digital products, services, and SaaS tools
7. **Insights** - Trends, forecasts, and business analytics
8. **Experience** - Immersive digital journeys and exploration

## Deployment Instructions

### Frontend (Vercel)

1. **Push to GitHub:**
   ```bash
   cd frontend
   git init
   git add .
   git commit -m "Initial frontend commit"
   git remote add origin https://github.com/yourusername/vnx-frontend.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Connect your GitHub repository to Vercel
   - Set build command: `npm run build`
   - Set output directory: `dist`
   - Add environment variable: `VITE_API_URL=https://your-railway-backend-url.railway.app`

### Backend (Railway)

1. **Push to GitHub:**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial backend commit"
   git remote add origin https://github.com/yourusername/vnx-backend.git
   git push -u origin main
   ```

2. **Deploy on Railway:**
   - Connect your GitHub repository to Railway
   - Add environment variables:
     - `DATABASE_URL` (PostgreSQL connection string)
     - `SESSION_SECRET` (random secure string)
     - `PORT=3001`
     - `NODE_ENV=production`

## Local Development

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

## Features

- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Modern UI Components** - Built with Radix UI and shadcn/ui
- **Type Safety** - Full TypeScript support
- **Authentication** - Passport.js integration
- **Database** - PostgreSQL with Drizzle ORM
- **Real-time Features** - WebSocket support
- **SEO Optimized** - Meta tags and Open Graph support

## Technology Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- React Query
- Wouter (routing)

**Backend:**
- Node.js
- Express
- TypeScript
- Drizzle ORM
- PostgreSQL
- Passport.js
- WebSockets

Made with ❤️ by Visnec Nexus