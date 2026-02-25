import { useAuth } from "@/components/AuthProvider";
import { useLocation } from "wouter";
import { useEffect } from "react";

interface AccessControlProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin' | 'super_admin';
  fallbackRoute?: string;
}

export function AccessControl({ 
  children, 
  requiredRole = 'user', 
  fallbackRoute = '/' 
}: AccessControlProps) {
  const { userRole, loading } = useAuth();
  const [, setLocation] = useLocation();

  const roleHierarchy = {
    'user': 1,
    'admin': 2,
    'super_admin': 3
  };

  const hasRequiredAccess = () => {
    if (!userRole) return false;
    const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[requiredRole];
    return userLevel >= requiredLevel;
  };

  useEffect(() => {
    if (!loading && !hasRequiredAccess()) {
      setLocation(fallbackRoute);
    }
  }, [userRole, loading, fallbackRoute, setLocation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!hasRequiredAccess()) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-4">
            You need {requiredRole.replace('_', ' ')} permissions to access this area.
          </p>
          <p className="text-sm text-gray-500">
            Current role: {userRole || 'Not assigned'}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}