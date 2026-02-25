import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Type definitions
type SubscriptionStatus = {
  status: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
};

interface SubscriptionContextType {
  subscription: SubscriptionStatus | null;
  isProUser: boolean;
  isLoading: boolean;
  refetchSubscription: () => Promise<void>;
}

// Create context
const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

// Provider component
export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Determine if user has pro access
  const isProUser = !!subscription && subscription.status === "active";

  // Fetch subscription data
  const fetchSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiRequest("GET", "/api/subscription");
      
      if (!response.ok) {
        throw new Error("Failed to fetch subscription data");
      }
      
      const data = await response.json();
      setSubscription(data);
    } catch (error: any) {
      console.error("Error fetching subscription:", error);
      setSubscription(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch subscription when user changes
  useEffect(() => {
    fetchSubscription();
  }, [user]);

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        isProUser,
        isLoading,
        refetchSubscription: fetchSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

// Hook for using the subscription context
export function useSubscription() {
  const context = useContext(SubscriptionContext);
  
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  
  return context;
}