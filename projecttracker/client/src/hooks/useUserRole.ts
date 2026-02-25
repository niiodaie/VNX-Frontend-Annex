import { useAuth } from "@/components/AuthProvider";

export default function useUserRole() {
  const { userRole, loading } = useAuth();

  const isAdmin = userRole === "admin" || userRole === "super_admin";
  const isSuperAdmin = userRole === "super_admin";

  return { 
    role: userRole, 
    loading, 
    isAdmin, 
    isSuperAdmin 
  };
}