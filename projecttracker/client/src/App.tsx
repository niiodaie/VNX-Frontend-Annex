import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as HotToaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/components/AuthProvider";
import { AdminRoute, SuperAdminRoute, UserRoute } from "@/components/RoleBasedRoute";
import Dashboard from "@/pages/dashboard/Dashboard";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import ProjectView from "@/pages/ProjectView";
import Login from "@/pages/LoginEnhanced";
import Signup from "@/pages/SignupEnhanced";
import ResetPassword from "@/pages/ResetPassword";
import ResetPasswordConfirm from "@/pages/ResetPasswordConfirm";
import Pricing from "@/pages/Pricing";
import Account from "@/pages/Account";
import Analytics from "@/pages/Analytics";
import Upgrade from "@/pages/Upgrade";
import UpgradeSuccess from "@/pages/UpgradeSuccess";
import Settings from "@/pages/Settings";
import Projects from "@/pages/Projects";
import Help from "@/pages/Help";
import Features from "@/pages/Features";
import Roadmap from "@/pages/Roadmap";
import Docs from "@/pages/Docs";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import AdminPanel from "@/pages/AdminPanel";
import AdminDashboard from "@/pages/AdminDashboard";
import DashboardAdmin from "@/pages/dashboard/AdminDashboard";
import DashboardSuperAdmin from "@/pages/dashboard/SuperAdminDashboard";
import ProjectPlanning from "@/pages/ProjectPlanning";
import ToastDemo from "@/pages/ToastDemo";

import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/reset-password/confirm" component={ResetPasswordConfirm} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/account" component={Account} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/upgrade" component={Upgrade} />
      <Route path="/upgrade/success" component={UpgradeSuccess} />
      <Route path="/settings" component={Settings} />
      <Route path="/projects" component={Projects} />
      <Route path="/project-planning" component={ProjectPlanning} />
      <Route path="/help" component={Help} />
      <Route path="/features" component={Features} />
      <Route path="/roadmap" component={Roadmap} />
      <Route path="/docs" component={Docs} />
      <Route path="/contact" component={Contact} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/admin">
        {() => (
          <SuperAdminRoute>
            <AdminPanel />
          </SuperAdminRoute>
        )}
      </Route>
      <Route path="/admin-dashboard">
        {() => {
          // Redirect old route to new structure
          setTimeout(() => window.location.href = '/dashboard/admin', 0)
          return <div>Redirecting...</div>
        }}
      </Route>
      <Route path="/dashboard/admin">
        {() => (
          <AdminRoute>
            <DashboardAdmin />
          </AdminRoute>
        )}
      </Route>
      <Route path="/dashboard/super-admin">
        {() => (
          <SuperAdminRoute>
            <DashboardSuperAdmin />
          </SuperAdminRoute>
        )}
      </Route>
      <Route path="/dashboard">
        {() => (
          <UserRoute>
            <Dashboard />
          </UserRoute>
        )}
      </Route>
      <Route path="/toast-demo" component={ToastDemo} />
      <Route path="/" component={Home} />
      <Route path="/project/:id" component={ProjectView} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <HotToaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            success: {
              style: {
                background: '#10b981',
                color: 'white',
                fontWeight: '500',
                border: 'none',
                borderRadius: '8px',
              },
            },
            error: {
              style: {
                background: '#ef4444',
                color: 'white',
                fontWeight: '500',
                border: 'none',
                borderRadius: '8px',
              },
            },
            loading: {
              style: {
                background: '#3b82f6',
                color: 'white',
                fontWeight: '500',
                border: 'none',
                borderRadius: '8px',
              },
            },
          }}
        />
        <Router />
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
