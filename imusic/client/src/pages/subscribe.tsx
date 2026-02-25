import { useEffect, useState } from "react";
import { Link, Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe with the public key
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing VITE_STRIPE_PUBLIC_KEY environment variable');
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm() {
  const [isLoading, setIsLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/subscribe/success",
        },
      });
      
      if (error) {
        toast({
          title: "Payment failed",
          description: error.message || "An unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Payment error",
        description: err.message || "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <PaymentElement />
      <Button type="submit" disabled={!stripe || isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Subscribe Now"
        )}
      </Button>
    </form>
  );
}

export default function SubscribePage() {
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    const getPaymentIntent = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequest("POST", "/api/create-subscription");
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create subscription");
        }
        
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err: any) {
        toast({
          title: "Subscription error",
          description: err.message || "Failed to start subscription process",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      getPaymentIntent();
    }
  }, [user, toast]);
  
  // Redirect to auth if not logged in
  if (!authLoading && !user) {
    return <Redirect to="/auth" />;
  }
  
  return (
    <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Upgrade to DarkNotes Pro</h1>
            <p className="text-gray-400 mt-2">
              Unlock the full potential of your music journey with our premium features.
            </p>
          </div>
          
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl flex items-center justify-between">
                <span>Pro Plan</span>
                <span className="text-purple-500">$14.99/month</span>
              </CardTitle>
              <CardDescription>Unlock the full potential of DarkNotes</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-purple-500 mr-2 shrink-0 mt-0.5" />
                  <span>Access to all AI mentors (beyond one free mentor)</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-purple-500 mr-2 shrink-0 mt-0.5" />
                  <span>Unlimited AI-generated music feedback and analysis</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-purple-500 mr-2 shrink-0 mt-0.5" />
                  <span>Advanced studio tools with AI collaboration</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-purple-500 mr-2 shrink-0 mt-0.5" />
                  <span>Access to all creative challenges and prizes</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-purple-500 mr-2 shrink-0 mt-0.5" />
                  <span>Priority voice generation for mentor feedback</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-400">
                Cancel anytime. No commitment required.
              </p>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
            <h3 className="text-xl font-semibold mb-6">Payment Details</h3>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              </div>
            ) : clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm />
              </Elements>
            ) : (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">Failed to initialize payment form</p>
                <Button asChild variant="outline">
                  <Link href="/">Return to Dashboard</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}