import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function WelcomeBanner() {
  const [name, setName] = useState("");
  const [userPlan, setUserPlan] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data, error } = await supabase
            .from("profiles")
            .select("display_name, subscription_plan, role")
            .eq("id", user.id)
            .single();

          if (!error && data) {
            if (data.display_name) {
              // Extract first name from display_name
              const firstName = data.display_name.split(" ")[0];
              setName(firstName);
            }
            
            // Set user plan with fallback to free
            const plan = data.subscription_plan || 'free';
            setUserPlan(plan);
            
            // Set user role with fallback to user
            const role = data.role || 'user';
            setUserRole(role);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">👋</span>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {getCurrentTimeGreeting()}{name ? `, ${name}!` : "!"}
            </h1>
            <div className="flex items-center gap-2">
              {userRole && userRole !== 'user' && (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  userRole === 'super_admin' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                  userRole === 'admin' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                }`}>
                  {userRole === 'super_admin' ? 'Super Admin' : 
                   userRole === 'admin' ? 'Admin' : 
                   userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </span>
              )}
              {userPlan && (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  userPlan === 'premium' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300' :
                  userPlan === 'pro' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                }`}>
                  {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} Plan
                </span>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            {name ? `Welcome back to your dashboard, ${name}!` : "Here's what's happening with your projects today."}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <span>📅</span>
              <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>⏱️</span>
              <span>{new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}