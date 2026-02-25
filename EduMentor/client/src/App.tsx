import { Suspense, lazy, useEffect, useState } from "react";
import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import NotFound from "@/pages/not-found";
import { Loader2 } from "lucide-react";

// Lazy load pages for better performance
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Courses = lazy(() => import("@/pages/courses"));
const Classroom = lazy(() => import("@/pages/classroom"));
const Certifications = lazy(() => import("@/pages/certifications"));
const InstructorCustomization = lazy(() => import("@/pages/instructor-customization"));

// Loading component for Suspense
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[80vh]">
    <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
  </div>
);

// Simple auth context - in a real app, use a proper auth provider
export interface User {
  id: number;
  username: string;
  displayName: string;
  email: string;
  language: string;
}

function Router() {
  const [location] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate auth check - in a real app, check session validity
    const initializeUser = async () => {
      try {
        // For demo, we'll auto-login as the demo user
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "demo",
            password: "password"
          }),
          credentials: "include"
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to initialize user:", error);
        toast({
          title: "Authentication Error",
          description: "Please try logging in again",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-800">
      <Navbar user={user} />
      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route 
              path="/" 
              component={() => user ? <Dashboard user={user} /> : <LoginRedirect />} 
            />
            <Route 
              path="/courses" 
              component={() => user ? <Courses user={user} /> : <LoginRedirect />} 
            />
            <Route 
              path="/classroom/:courseId/:lessonId" 
              component={(params) => 
                user ? 
                <Classroom 
                  user={user} 
                  courseId={parseInt(params.courseId)} 
                  lessonId={parseInt(params.lessonId)} 
                /> : 
                <LoginRedirect />
              } 
            />
            <Route 
              path="/certifications" 
              component={() => user ? <Certifications user={user} /> : <LoginRedirect />} 
            />
            <Route 
              path="/instructors/customize" 
              component={() => user ? <InstructorCustomization user={user} /> : <LoginRedirect />} 
            />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

// Simple redirect component for unauthorized access
const LoginRedirect = () => {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    setLocation("/");
  }, [setLocation]);
  
  return <PageLoader />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
