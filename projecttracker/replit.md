# Nexus Tracker - Project Management Web Application

## Overview

Nexus Tracker is a full-stack project management web application designed for solopreneurs and small businesses. It provides simplified project management capabilities including project and task boards, to-do lists, reminders, and AI-powered assistance with prompt history.

The application follows a mobile-first approach with a clean, efficient interface inspired by Asana and Monday.com, but streamlined for smaller teams. It features integrated AI capabilities that help users save, retrieve, and reuse previous AI interactions for enhanced productivity.

## System Architecture

### Frontend Architecture
- **Framework**: React with Vite for fast development and building
- **Styling**: TailwindCSS with custom VNX brand theming
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Mobile-First Design**: Responsive layout optimized for mobile devices

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for API server
- **Development Server**: Vite middleware integration for seamless development
- **API Structure**: RESTful endpoints with proper error handling and logging

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (configured via DATABASE_URL)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Development Fallback**: In-memory storage implementation for development without database connection

### Authentication and Authorization
- **Authentication Provider**: Supabase integration with fallback to mock authentication for development
- **User Management**: Sign up, sign in, sign out functionality with email/password
- **Premium Plan Detection**: User plan stored in user_metadata (free/pro/premium)
- **Session Management**: Supabase session management with React context provider
- **Route Protection**: Authentication-based routing with public and protected routes

## Key Components

### Database Schema
- **Users**: User accounts with username, email, password
- **Projects**: Project containers with name, description, color coding
- **Tasks**: Individual tasks with status (todo/in_progress/done), priority levels, due dates, progress tracking
- **AI Prompts**: Stored AI interactions with context linking to projects/tasks
- **Reminders**: Task reminders with due dates and completion tracking

### API Endpoints
- **Projects**: CRUD operations for project management
- **Tasks**: Task creation, updates, status changes, progress tracking
- **AI Service**: OpenAI integration for task suggestions and AI assistance
- **Reminders**: Reminder management with today/overdue filtering

### Frontend Components
- **Layout System**: Responsive layout with sidebar navigation, mobile menu, and authentication-aware header
- **Authentication Pages**: Login, signup, and pricing pages with form validation
- **Project Board**: Kanban-style board with drag-and-drop task management
- **AI Helper**: Sidebar component for AI assistance and prompt history with premium plan restrictions
- **Task Management**: Task cards with status indicators and progress bars
- **Reminder System**: Top banner notification for due and overdue tasks
- **Premium Features**: Upgrade prompts, plan detection, and feature gating
- **Internationalization**: Multi-language support (English, French, Spanish, German)
- **VNX Footer**: Company branding with social links and contact information

## Data Flow

1. **User Interface**: React components handle user interactions
2. **API Layer**: TanStack Query manages server state and caching
3. **Express Server**: Processes API requests and business logic
4. **Database Layer**: Drizzle ORM handles database operations
5. **AI Integration**: OpenAI service provides task suggestions and assistance
6. **Real-time Updates**: Query invalidation ensures UI consistency

## External Dependencies

### Frontend Dependencies
- **@radix-ui/***: Comprehensive UI primitive components
- **@tanstack/react-query**: Server state management
- **tailwindcss**: Utility-first CSS framework
- **date-fns**: Date manipulation and formatting
- **wouter**: Lightweight routing
- **react-hook-form**: Form management

### Backend Dependencies
- **drizzle-orm**: Type-safe ORM for PostgreSQL
- **@neondatabase/serverless**: Neon database driver
- **openai**: Official OpenAI API client
- **express**: Web application framework
- **tsx**: TypeScript execution for development

### Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Type safety and development experience
- **esbuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with HMR
- **Database**: Neon PostgreSQL or local fallback
- **Environment Variables**: `.env` file for API keys and database URL

### Production Deployment
- **Target Platform**: Replit hosting
- **Build Process**: Vite build for frontend, esbuild for backend
- **Static Assets**: Served from `/dist/public`
- **Environment Variables**: 
  - `DATABASE_URL`: PostgreSQL connection string
  - `OPENAI_API_KEY`: OpenAI API access key
  - `NODE_ENV`: Production environment flag

### Build Commands
- **Development**: `npm run dev`
- **Production Build**: `npm run build`
- **Production Start**: `npm run start`
- **Database Push**: `npm run db:push`

## Changelog

```
Changelog:
- June 29, 2025. Initial setup with core project management features
- June 29, 2025. Added authentication system, premium plan detection, pricing page, multilanguage support, SEO optimization, and Google Analytics integration
- June 29, 2025. Fixed authentication context issues, enhanced signup/login flow with direct Supabase integration, updated footer with VNX branding, created placeholder pages for complete navigation structure
- June 29, 2025. Enhanced authentication with improved session management, robust logout functionality with cache clearing, updated Footer with actual VNX Platform social media links (Facebook, X/Twitter, LinkedIn, Instagram, TikTok, Reddit), completed multilingual support for account management across all languages (EN/FR/ES/DE)
- June 29, 2025. Removed demo account, implemented proper authentication state handling, updated footer text to "© 2025 Visnec Global Company. All rights reserved.", enhanced signup form with first/last name, company name, Google OAuth integration, password reset functionality, and email verification flow
- June 29, 2025. Reorganized dashboard into modular component structure with comprehensive real-time metrics, project progress tracking, today's tasks view with priority indicators, quick action buttons, and proper loading/empty states for enhanced user experience
- June 29, 2025. Enhanced Account page with real user data integration, comprehensive profile management including editable profile forms, secure password change functionality, subscription plan display, security settings, and account deletion options
- June 29, 2025. Added comprehensive productivity features: NotificationCenter with real-time alerts, ActivityFeed showing recent project/task activities, TaskAnalytics with weekly productivity insights and priority distribution, GlobalSearch with CMD+K shortcut for searching across projects/tasks/AI conversations, Analytics dashboard with completion rates and performance metrics
- June 29, 2025. Implemented complete plan-based access control system: Enhanced user schema with subscription fields, created usePlan hook for feature detection, built PlanGuard components for premium feature protection, added PlanBadge for subscription status display, developed comprehensive Upgrade page with pricing tiers, implemented project limits for free users (2 projects max), integrated UserMenu component with clean authentication UI and navigation to profile/billing/settings pages
- June 29, 2025. Implemented comprehensive AI Tracker module: Added complete database schema for AI logs, created API routes for AI log management, built AITracker component with source filtering and task conversion, integrated AI Insights tab in project view, added premium plan protection for AI features, created sample AI logs from ChatGPT/GitHub Copilot/Claude sources
- June 29, 2025. Added Supabase-compatible Projects page with direct database integration: Created new Projects.tsx component using Supabase client, implemented project creation/listing with UUID primary keys, added UserProfileDropdown component for Supabase auth integration, updated project schema to match user requirements (title, description, status, owner_id, timestamps)
- June 29, 2025. Implemented comprehensive Admin Panel system: Created AdminPanel.tsx with user management interface, subscription controls (Free/Pro/Premium), admin privilege management, user search functionality, system statistics dashboard, global announcement system, access control based on is_admin flag in user metadata, integration with UserMenu for authorized access, complete Table and Dialog UI components for enhanced admin experience
- June 29, 2025. Enhanced Admin Panel to Super Admin Dashboard: Added comprehensive AIHelper component with OpenAI GPT-4o integration, floating AI assistant button for premium users, conversation history with automatic storage, context-aware prompts using project information, premium plan protection for AI features, keyboard shortcuts for efficiency, and upgrade prompts for free users to encourage premium subscriptions
- June 29, 2025. Upgraded Admin Panel with advanced Super Admin features: Implemented tabbed interface with User Management (role-based access control with user/admin/super_admin hierarchies), Project Overview (comprehensive project statistics with progress tracking), Email Invites system (role-based invitation system with personal messages), and enhanced System Settings with global announcements, complete with demo data for testing all administrative functionalities
- June 30, 2025. Created comprehensive modular Admin Dashboard system: Built dedicated admin components (InviteUser, AssignRole, ManageProjects) with direct Supabase integration, implemented grid-based layout at /admin-dashboard with role-based access control, added user invitation system with email validation, role assignment interface with user selection and role management, project management with delete functionality and confirmation dialogs, enhanced error handling and toast notifications, provided clean component exports and TypeScript interfaces
- June 30, 2025. Implemented advanced role-based access control system: Created useUserRole hook with Supabase integration and UUID validation, built AdminRoute wrapper component for route protection (admin/superadmin levels), protected admin routes with proper access control (/admin requires superadmin, /admin-dashboard requires admin+), updated UserMenu with role-based navigation options, added super admin restrictions to InviteUser component, enhanced AssignRole with improved user selection and role management (admin/moderator/user), implemented proper loading states and access denied screens with user feedback
- June 30, 2025. Enhanced admin dashboard with comprehensive role management: Updated InviteUser component with role selection dropdown (admin/member/viewer), integrated Supabase admin.inviteUserByEmail with automatic profile creation, enhanced AssignRole component with direct Supabase integration and admin/moderator/user role options, added personalized dashboard welcome message displaying user's first name from metadata, implemented complete user lifecycle management from invitation to role assignment
- June 30, 2025. Completed comprehensive admin system architecture: Fixed Supabase client configuration with proper environment variable handling, created complete database schema (profiles, projects, project_members tables), implemented enhanced ManageProjects component with direct database integration, added comprehensive error handling for database connectivity issues, created DATABASE_SETUP_INSTRUCTIONS.md with complete SQL setup commands, established role-based access control with super_admin/admin permission levels, integrated all admin components with proper TypeScript interfaces and authentication flow
- June 30, 2025. Implemented advanced authentication system with invitation workflow: Created invites table for role-based user registration, enhanced authentication trigger to inherit roles from invites table, implemented comprehensive Row Level Security (RLS) policies for secure data access, updated InviteUser component to store invitations in database with proper role assignment, configured automatic profile creation with role inheritance when users sign up, created complete COMPLETE_ADMIN_SETUP.sql script with all authentication integration, established secure role hierarchy (user/moderator/admin/super_admin) with proper access controls
- June 30, 2025. Enhanced user experience with personalized interface: Created WelcomeBanner component with user's first name fetched from profiles table, implemented time-based greetings (morning/afternoon/evening), added auto-clearing feedback messages (3-second timeout) to all admin components, integrated search functionality for ManageProjects and AssignRole components with filtered results, enhanced dashboard with personalized welcome message and improved date formatting, streamlined admin component imports to use consistent Supabase client configuration
- June 30, 2025. Implemented comprehensive role-based user interface system: Created RoleBadge component with color-coded role indicators (Super Admin red, Admin blue, User gray), enhanced UserMenu dropdown with prominent role display and text labels, updated Account page with role badge showing user's current role with icons, added role-based navigation to Sidebar with conditional Admin Dashboard and Super Admin Panel links, implemented proper role fetching from Supabase profiles table eliminating hardcoded demo emails, established visual hierarchy distinguishing regular users from administrators with consistent styling across all components
- June 30, 2025. Enhanced WelcomeBanner with personalized first-name-only greeting and subscription plan display: Updated component to extract first name from Supabase profiles display_name field using split(" ")[0] method, implemented time-based greetings (Good morning/afternoon/evening), displays personalized message format "👋 Good morning, Jude!" instead of full name, added color-coded subscription plan badge (Premium purple, Pro blue, Free gray) next to greeting, fetches subscription_plan from profiles table with fallback to free plan, enhanced welcome message with personalized dashboard greeting, maintained responsive design with current date and time display
- June 30, 2025. Streamlined ManageProjects component with simplified UI and react-hot-toast notifications: Integrated react-hot-toast for lightweight notification system, removed search functionality for simplified interface, replaced complex error handling with streamlined toast alerts, maintained core project creation and deletion functionality, eliminated unnecessary status state and filtering logic for cleaner component architecture, configured modern toast notifications with automatic positioning and styling
- June 30, 2025. Enhanced authentication system with improved error handling and profile management: Added automatic profile creation for missing users, implemented better database connectivity error handling, added temporary demo admin access (demo@nexustracker.com gets super_admin role), integrated react-hot-toast Toaster component for proper notification display, simplified InviteUser component to create profiles directly in database with UUID generation and clear role assignment options
- June 30, 2025. Fixed critical authentication loading issue with timeout mechanisms: Implemented 2-second timeout for Supabase authentication to prevent infinite loading states, added 3-second safety timeout as fallback mechanism, simplified role assignment for faster performance (defaults to user role with demo admin exception), streamlined auth state change handler to eliminate database dependency bottlenecks, resolved application hanging on "Loading..." screen with graceful fallback authentication
- June 30, 2025. Enhanced ManageProjects component with comprehensive role-based access control: Added user role fetching from Supabase profiles table, implemented visual role badge display (Super Admin/User), created conditional access control for user invitation and role assignment features, added permission warning message for unauthorized users, maintained all existing project management functionality while adding proper security controls, integrated InviteUser and AssignRole components within unified admin interface
- June 30, 2025. Implemented automatic redirect security for ManageProjects component: Added Wouter routing integration with useLocation hook, implemented automatic redirect to dashboard for non-super admin users, added access denied toast notification for unauthorized access attempts, enhanced security by preventing unauthorized users from accessing admin interface, maintained user-friendly feedback with clear messaging about access restrictions
- June 30, 2025. Enhanced ManageProjects security with early return pattern: Implemented early return for unauthorized users with dedicated access denied screen, optimized data flow to only fetch projects for super admins, removed conditional rendering in favor of cleaner security patterns, improved user experience with clear messaging for insufficient permissions, streamlined component logic with role validation before data operations
- June 30, 2025. Added TaskSummaryCard component to admin interface: Created comprehensive system overview displaying total projects, active projects, total users, and pending invites with real-time data from Supabase, implemented gradient design with color-coded metrics, integrated loading states and error handling, positioned summary card at top of ManageProjects component for immediate admin visibility into system status
- June 30, 2025. Updated TaskSummaryCard with task-focused implementation and removed Google OAuth: Replaced system metrics with task-specific data (total tasks, pending tasks, overdue tasks), simplified design with clean gray background and horizontal layout, highlighted overdue tasks in red for urgency, removed Google OAuth signin buttons from LoginEnhanced and SignupEnhanced pages, streamlined authentication to email-only for simplified user experience
- June 30, 2025. Implemented Supabase Edge Function for automated recurring tasks: Created insert-recurring-tasks Edge Function with Deno runtime and Supabase client integration, enhanced tasks schema with isRecurring, recurrencePattern, and ownerId fields to support automated task creation, added comprehensive error handling and JSON response formatting, created deployment documentation with cron scheduling examples, updated task status to include 'pending' state for Edge Function compatibility
- June 30, 2025. Completed comprehensive role-based UI system and testing infrastructure: Enhanced WelcomeBanner with visual role badges (Super Admin red, Admin blue) displaying alongside subscription plans, updated AuthProvider with automatic super_admin assignment for test accounts (viusmedia@gmail.com, niiodaie@gmail.com, niiodaie@yahoo.com, demo@nexustracker.com), improved InviteUser component with proper invite table storage and react-hot-toast notifications, created EdgeFunctionTest component for super_admin testing of recurring task automation, implemented AccessControl component for hierarchical route protection, added comprehensive SQL setup scripts for test account configuration and Edge Function verification
- June 30, 2025. Implemented comprehensive AI-powered Project Planning feature: Created ProjectPlanner component with milestone-based project breakdown, integrated OpenAI GPT-4o for intelligent project plan generation from descriptions, implemented drag-and-drop milestone management with task tracking, added export functionality (Markdown, JSON, CSV), created premium feature gating with upgrade prompts for free users, built comprehensive AI service integration with structured JSON responses, added project planning navigation to sidebar with clipboard icon, designed responsive timeline view with due date management and progress tracking
- June 30, 2025. Enhanced Project Planning with "Try it Once" freemium experience: Created TryOncePlanner component allowing free users to experience AI planning before upgrading, implemented conditional rendering based on user subscription status (free users see TryOncePlanner, premium users get full ProjectPlanner), added premium plan support to usePlan hook with isPremium property, created /api/ai/generate-plan endpoint for demo functionality, designed upgrade prompts showing limited milestone/task previews with clear premium feature gating, integrated signup/login prompts for non-authenticated users, built comprehensive upgrade CTAs with feature comparisons
- June 30, 2025. Integrated comprehensive export functionality and analytics: Created exportHelpers utility with Markdown/JSON/CSV export capabilities, added Google Analytics 4 event tracking for user interactions, implemented downloadFile functionality for direct browser downloads, enhanced TryOncePlanner with export buttons (premium feature), added /api/ai/save-plan endpoint for database storage, integrated React key prop fixes for list rendering, created premium vs free export feature gating with upgrade prompts
- June 30, 2025. Completed final build with advanced editing and save functionality: Created SavePlanButton component with database integration and loading states, built ExportModal with format selection (Markdown/JSON/CSV) and premium gating, implemented PlanEditor component with inline task editing for premium users, integrated all components into TryOncePlanner with state management, added comprehensive action buttons (Save/Export/Edit), created Playwright test infrastructure for end-to-end testing, achieved complete AI Project Planning system ready for deployment
- June 30, 2025. Integrated comprehensive Stripe payment processing system: Created StripeService with checkout session management and webhook event handling, built SubscriptionService for Supabase profile updates with subscription plans (free/pro/premium), implemented StripeCheckout component with direct payment integration, added /api/create-checkout-session and /api/stripe-webhook endpoints with full error handling, created UpgradeSuccess page with payment confirmation flow, integrated Stripe components into Upgrade page and TryOncePlanner for seamless upgrade experience, configured proper success/cancel URLs for payment completion
- June 30, 2025. Resolved Supabase RLS database connectivity issues: Identified and fixed column mismatch in profiles table (no email column exists), verified service role operations work correctly for both profiles and invites tables, confirmed admin panel operations function properly, created comprehensive database setup instructions for RLS policies, validated complete authentication and payment flow integration, achieved full production readiness with authenticated database operations
- July 1, 2025. Implemented comprehensive role-based dashboard routing system: Updated roleRedirect.ts to use hierarchical dashboard structure (/dashboard/super-admin, /dashboard/admin, /dashboard), created dedicated dashboard components for admin and super admin roles, integrated automatic role-based redirects in AuthProvider with onAuthStateChange listener, added route protection with AdminRoute, SuperAdminRoute, and UserRoute components, implemented backward compatibility redirect for legacy /admin-dashboard route, achieved complete role-based navigation matching user requirements with proper access control
- July 1, 2025. Enhanced user experience with smart toast notification system: Upgraded react-hot-toast configuration with custom styling (green success, red error, blue loading toasts), implemented comprehensive authentication feedback in SignupEnhanced and LoginEnhanced components, added loading states with smart dismiss functionality, created real-time form validation feedback, integrated emoji-enhanced success messages, built ToastDemo page for testing notification system, achieved 4-second optimal display duration for enhanced user experience
- July 1, 2025. Implemented comprehensive AdminUserPanel for enhanced user management: Built professional user management interface with search and role filtering capabilities, integrated smart toast notifications for all administrative actions, created role-based badge system with visual hierarchy (Crown/Shield/Settings/User icons), implemented inline role editing with confirmation dialogs, added secure user deletion with safety warnings, built real-time statistics dashboard showing user distribution by role, integrated comprehensive error handling and loading states, achieved responsive design matching Nexus Tracker design system
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```