import { ReactNode } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/use-subscription";
import { Crown, Lock } from "lucide-react";

type FeatureType = 
  | "all_mentors" 
  | "unlimited_feedback" 
  | "advanced_studio" 
  | "all_challenges" 
  | "any";

interface ProFeatureProps {
  children: ReactNode;
  featureType: FeatureType;
  fallback?: ReactNode;
}

/**
 * Wrapper component that only renders its children if the user has a Pro subscription
 * If user isn't subscribed to Pro, renders a fallback UI or a default upgrade prompt
 */
export function ProFeature({ children, featureType, fallback }: ProFeatureProps) {
  const { isProUser } = useSubscription();
  
  // If user is Pro, show the actual feature
  if (isProUser) {
    return <>{children}</>;
  }
  
  // If a fallback is provided, show it instead of the default
  if (fallback) {
    return <>{fallback}</>;
  }
  
  // Default upgrade prompt
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] flex items-center justify-center z-10">
        <div className="text-center p-4 max-w-xs">
          <div className="bg-purple-900/50 h-12 w-12 flex items-center justify-center rounded-full mx-auto mb-3">
            <Lock className="h-6 w-6 text-purple-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">Pro Feature</h3>
          <p className="text-gray-400 text-sm mb-4">
            {getFeatureDescription(featureType)}
          </p>
          <Button asChild size="sm" className="bg-gradient-to-r from-purple-800 to-purple-600">
            <Link href="/subscribe">Upgrade to Pro</Link>
          </Button>
        </div>
      </div>
      <div className="opacity-40 blur-[1px] pointer-events-none">
        {children}
      </div>
    </div>
  );
}

/**
 * A small badge to indicate Pro features
 */
export function ProBadge() {
  return (
    <div className="flex items-center bg-gradient-to-r from-purple-900 to-purple-700 px-2 py-1 rounded-full text-white text-xs">
      <Crown className="h-3 w-3 mr-1" />
      <span>PRO</span>
    </div>
  );
}

/**
 * A button that redirects to the subscription page
 */
export function UpgradeButton() {
  const { isProUser } = useSubscription();
  
  if (isProUser) return null;
  
  return (
    <Button asChild size="sm" className="bg-gradient-to-r from-purple-800 to-purple-600">
      <Link href="/subscribe">Upgrade to Pro</Link>
    </Button>
  );
}

/**
 * Helper function to get a description based on the feature type
 */
function getFeatureDescription(featureType: FeatureType): string {
  switch (featureType) {
    case "all_mentors":
      return "Access to all AI mentors is available with DarkNotes Pro.";
    case "unlimited_feedback":
      return "Unlimited AI-generated feedback is available with DarkNotes Pro.";
    case "advanced_studio":
      return "Advanced studio tools are available with DarkNotes Pro.";
    case "all_challenges":
      return "Premium challenges with industry prizes require DarkNotes Pro.";
    case "any":
    default:
      return "This premium feature is available with DarkNotes Pro.";
  }
}