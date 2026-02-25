# TikTalk - Podcast Platform MVP

## Overview

TikTalk is a modern podcast platform built as a full-stack application that enables podcasters to create and manage shows, upload episodes, and allows listeners to browse, stream, and follow podcasts. The platform is designed with a clean, mobile-first interface and focuses on simplicity for both creators and listeners.

## System Architecture

The application follows a modern monorepo structure with clear separation between frontend, backend, and shared components:

- **Frontend**: React-based single-page application built with Vite
- **Backend**: Express.js REST API with PostgreSQL database
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Replit OIDC integration with session management
- **File Storage**: Local file system with multer for audio and image uploads
- **UI Components**: Shadcn/ui component library with Tailwind CSS styling

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite bundler
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state and caching
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Audio Playback**: Custom HTML5 audio player component with progress tracking

### Backend Architecture
- **Server**: Express.js with TypeScript
- **API Design**: RESTful endpoints with proper HTTP status codes
- **Database Layer**: Drizzle ORM with connection pooling via Neon serverless
- **File Handling**: Multer middleware for multipart form uploads
- **Error Handling**: Centralized error middleware with proper logging
- **Development**: Hot reloading with Vite integration in development mode

### Database Schema
The PostgreSQL schema includes:
- **Users**: Authentication data with profile information
- **Podcasts**: Show metadata with creator relationships
- **Episodes**: Audio content with podcast associations
- **Follows**: User-podcast subscription relationships
- **Play History**: Listening progress tracking
- **Sessions**: Secure session storage for authentication

### Authentication System
- **Provider**: Replit OIDC for seamless development environment integration
- **Session Management**: PostgreSQL-backed session store with TTL
- **Security**: HTTP-only cookies with secure flags and CSRF protection
- **User Flow**: Automatic redirection for unauthenticated users

## Data Flow

1. **User Authentication**: OIDC flow with Replit, session creation in PostgreSQL
2. **Content Creation**: File upload → local storage → database metadata insertion
3. **Content Discovery**: Database queries with joins for optimized data fetching
4. **Audio Streaming**: Direct file serving from local storage with range request support
5. **Real-time Updates**: Client-side cache invalidation via TanStack Query

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection with serverless compatibility
- **drizzle-orm**: Type-safe database operations and migrations
- **@tanstack/react-query**: Server state management and caching
- **multer**: File upload handling
- **express-session**: Session management
- **passport**: Authentication middleware

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives for components
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **wouter**: Lightweight React router

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express API proxy
- **Hot Reloading**: Automatic restart for server changes, HMR for client
- **Database**: Neon PostgreSQL with connection pooling
- **File Storage**: Local filesystem in development

### Production Considerations
The current setup is optimized for development with these production requirements:
- **File Storage**: Migrate to cloud storage (AWS S3, Cloudinary)
- **Database**: Production PostgreSQL with proper connection limits
- **Session Store**: Redis or similar for distributed sessions
- **CDN**: Content delivery network for audio file streaming
- **Environment Variables**: Secure configuration management

### Build Process
- **Client Build**: Vite bundling with TypeScript compilation
- **Server Build**: ESBuild for Node.js production bundle
- **Asset Optimization**: Automatic minification and tree-shaking
- **Type Checking**: Full TypeScript validation during build

## Changelog

```
Changelog:
- July 07, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```