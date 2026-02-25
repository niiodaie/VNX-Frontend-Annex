import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";

export default function DashboardHeader() {
  const { user } = useAuth();
  const [name, setName] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;

      try {
        // First try to get name from user metadata
        const userMetadata = user.user_metadata;
        if (userMetadata?.first_name) {
          setName(userMetadata.first_name);
          return;
        }
        
        if (userMetadata?.full_name) {
          setName(userMetadata.full_name.split(' ')[0]);
          return;
        }

        // Fallback to profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", user.id)
          .single();

        if (profile?.display_name) {
          setName(profile.display_name);
        } else {
          // Extract first name from email if no other name available
          const emailName = user.email?.split('@')[0];
          setName(emailName || 'there');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Fallback to email-based name
        const emailName = user.email?.split('@')[0];
        setName(emailName || 'there');
      }
    }

    fetchProfile();
  }, [user]);

  return (
    <div className="mt-6 mb-4">
      <h1 className="text-2xl font-bold">Welcome back, {name || "there"}!</h1>
      <p className="text-sm text-gray-500">Here's what's happening with your projects today.</p>
    </div>
  );
}