import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

type SubscriptionStatus = {
  status: string;
  currentPeriodEnd?: string;
};

export default function SubscribeSuccessPage() {
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getSubscriptionStatus() {
      try {
        const response = await apiRequest("GET", "/api/subscription");
        if (!response.ok) {
          throw new Error("Failed to fetch subscription status");
        }
        const data = await response.json();
        setSubscription(data);
      } catch (error: any) {
        toast({
          title: "Error fetching subscription",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      getSubscriptionStatus();
    } else if (!authLoading) {
      setLocation("/auth");
    }
  }, [user, authLoading, setLocation, toast]);

  function formatDate(dateString?: string) {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-[#1a1a1a] border-gray-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-purple-400">
            DarkNotes Pro
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          {isLoading ? (
            <div className="py-8 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : subscription ? (
            <>
              <div className="w-16 h-16 rounded-full bg-purple-900 mx-auto flex items-center justify-center">
                <Check className="h-8 w-8 text-white" />
              </div>
              
              <h2 className="text-xl font-semibold">Thank You!</h2>
              
              <p className="text-gray-300">
                Your subscription has been {subscription.status === "active" ? "activated" : "processed"}!
              </p>
              
              {subscription.status === "active" && subscription.currentPeriodEnd && (
                <div className="mt-4 p-4 bg-[#232323] rounded-md">
                  <p className="text-sm text-gray-400">Your next billing date:</p>
                  <p className="font-medium">{formatDate(subscription.currentPeriodEnd)}</p>
                </div>
              )}
              
              <div className="space-y-3 mt-4">
                <h3 className="text-sm font-medium">What's included in your Pro plan:</h3>
                <ul className="space-y-2 text-left">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-purple-500 mr-2 shrink-0 mt-0.5" />
                    <span>Access to all AI mentors</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-purple-500 mr-2 shrink-0 mt-0.5" />
                    <span>Unlimited AI-generated feedback</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-purple-500 mr-2 shrink-0 mt-0.5" />
                    <span>Advanced studio tools</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-purple-500 mr-2 shrink-0 mt-0.5" />
                    <span>Access to all challenges and prizes</span>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <p className="text-red-400">Unable to retrieve subscription information</p>
          )}
          
          <div className="pt-4">
            <Button asChild className="w-full bg-[#332940] hover:bg-[#3D304C]">
              <Link href="/">Go to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}