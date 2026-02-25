import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calendar, Check, CreditCard, Loader2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { TestSubscription } from "@/components/subscription/test-subscription";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type SubscriptionData = {
  status: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
};

export default function SubscriptionPage() {
  const [location, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelingSubscription, setCancelingSubscription] = useState(false);
  
  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/auth");
    }
  }, [user, authLoading, setLocation]);
  
  // Fetch subscription status
  useEffect(() => {
    async function getSubscriptionStatus() {
      try {
        setIsLoading(true);
        const response = await apiRequest("GET", "/api/subscription");
        if (!response.ok) {
          throw new Error("Failed to fetch subscription status");
        }
        const data = await response.json();
        setSubscription(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch subscription",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    if (user) {
      getSubscriptionStatus();
    }
  }, [user, toast]);
  
  // Handle subscription cancellation
  const handleCancelSubscription = async () => {
    try {
      setCancelingSubscription(true);
      const response = await apiRequest("POST", "/api/cancel-subscription");
      
      if (!response.ok) {
        throw new Error("Failed to cancel subscription");
      }
      
      const data = await response.json();
      setSubscription(prev => prev ? { ...prev, ...data } : null);
      
      toast({
        title: "Subscription Canceled",
        description: "Your subscription will end at the current billing period",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel subscription",
        variant: "destructive",
      });
    } finally {
      setCancelingSubscription(false);
    }
  };
  
  // Format date for display
  function formatDate(dateString?: string) {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  
  // Get badge color based on subscription status
  const getStatusBadge = () => {
    if (!subscription) return null;
    
    switch (subscription.status) {
      case "active":
        return <Badge className="bg-emerald-500">Active</Badge>;
      case "trialing":
        return <Badge className="bg-blue-500">Trial</Badge>;
      case "past_due":
        return <Badge className="bg-amber-500">Past Due</Badge>;
      case "canceled":
        return <Badge className="bg-gray-500">Canceled</Badge>;
      case "unpaid":
        return <Badge className="bg-red-500">Unpaid</Badge>;
      default:
        return <Badge className="bg-gray-500">{subscription.status}</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <header className="border-b border-[#333] border-opacity-50 px-4 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/">
            <span className="text-3xl font-['Playfair_Display'] text-purple-400 cursor-pointer">
              DarkNotes
            </span>
          </Link>
          
          <Link href="/">
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-semibold mb-8">Subscription Management</h1>
        
        {!subscription || subscription.status === "none" ? (
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <CardTitle>No Subscription</CardTitle>
              <CardDescription className="text-gray-400">
                You don't currently have an active subscription
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-[#232323] p-4 rounded-md">
                <div className="flex items-start">
                  <div className="bg-purple-900 p-2 rounded-full mr-4">
                    <AlertTriangle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Limited Access</h3>
                    <p className="text-sm text-gray-400">
                      You're currently on the free plan with limited features. Upgrade to Pro for full access.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button asChild className="w-full bg-[#332940] hover:bg-[#3D304C]">
                  <Link href="/subscribe">Upgrade to Pro</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">DarkNotes Pro</CardTitle>
                  {getStatusBadge()}
                </div>
                <CardDescription className="text-gray-400">
                  Your subscription details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400">Status</div>
                    <div className="font-medium flex items-center">
                      {subscription.status === "active" ? (
                        <>
                          <Check className="h-4 w-4 text-emerald-500 mr-2" />
                          Active Subscription
                        </>
                      ) : subscription.status === "canceled" || subscription.cancelAtPeriodEnd ? (
                        <>
                          <XCircle className="h-4 w-4 text-amber-500 mr-2" />
                          Canceled
                          {subscription.cancelAtPeriodEnd && " (Access until period end)"}
                        </>
                      ) : (
                        <>
                          <div>{subscription.status}</div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400">Next Billing Date</div>
                    <div className="font-medium flex items-center">
                      <Calendar className="h-4 w-4 text-purple-400 mr-2" />
                      {subscription.currentPeriodEnd 
                        ? formatDate(subscription.currentPeriodEnd) 
                        : "Not available"}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400">Plan</div>
                    <div className="font-medium">Pro Monthly</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400">Price</div>
                    <div className="font-medium flex items-center">
                      <CreditCard className="h-4 w-4 text-purple-400 mr-2" />
                      $14.99/month
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Included in your plan:</h3>
                  <ul className="space-y-2">
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
              </CardContent>
              
              <CardFooter className="border-t border-gray-800 pt-6 flex-col items-stretch space-y-3">
                {subscription.status === "active" && !subscription.cancelAtPeriodEnd ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="border-gray-700 bg-transparent hover:bg-red-900/10 hover:text-red-400">
                        Cancel Subscription
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-[#1E1E1E] border-gray-800">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                          If you cancel, your subscription will remain active until the end of the current billing period. After that, you'll be downgraded to the free plan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-gray-700 hover:bg-gray-800">
                          No, Keep My Subscription
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleCancelSubscription}
                          className="bg-red-900 hover:bg-red-800 text-white"
                          disabled={cancelingSubscription}
                        >
                          {cancelingSubscription ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Canceling...
                            </>
                          ) : (
                            "Yes, Cancel Subscription"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : subscription.cancelAtPeriodEnd ? (
                  <div className="text-center p-3 bg-[#232323] rounded-md text-gray-300 text-sm">
                    Your subscription has been canceled and will end on {formatDate(subscription.currentPeriodEnd)}
                  </div>
                ) : null}
                
                <div className="text-center text-xs text-gray-500">
                  For billing issues, please contact support@darknotes.com
                </div>
              </CardFooter>
            </Card>
            
            <div className="text-center">
              <Link href="/">
                <Button variant="ghost" className="text-gray-400 hover:text-white">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            
            {/* Test utility - only visible in development */}
            {import.meta.env.DEV && (
              <div className="mt-8">
                <div className="text-sm text-amber-500 mb-2">Development Testing Tools</div>
                <TestSubscription />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}