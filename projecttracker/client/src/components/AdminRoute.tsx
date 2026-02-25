import React from "react";
import { useLocation } from "wouter";
import useUserRole from "@/hooks/useUserRole";
import { Layout } from "@/components/Layout";

interface AdminRouteProps {
  children: JSX.Element;
  requireSuperAdmin?: boolean;
}

const AdminRoute = ({ children, requireSuperAdmin = false }: AdminRouteProps) => {
  const { role, loading } = useUserRole();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Verifying access...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Check if user has required permissions
  const hasAccess = requireSuperAdmin 
    ? role === "superadmin"
    : (role === "admin" || role === "superadmin");

  if (!hasAccess) {
    setTimeout(() => {
      setLocation("/dashboard");
    }, 100);
    
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
              <p className="text-gray-600 mb-4">
                {requireSuperAdmin 
                  ? "Super admin privileges required to access this page."
                  : "Admin privileges required to access this page."
                }
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to dashboard...
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return children;
};

export default AdminRoute;