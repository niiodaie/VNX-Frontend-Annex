import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import toast from 'react-hot-toast';

interface StripeCheckoutProps {
  plan?: 'pro' | 'premium';
  children?: React.ReactNode;
}

export function StripeCheckout({ plan = 'pro', children }: StripeCheckoutProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const createCheckoutMutation = useMutation({
    mutationFn: async (checkoutData: { userId: string; email: string; plan?: string }) => {
      const response = await apiRequest('POST', '/api/create-checkout-session', checkoutData);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error('Failed to create checkout session');
        setIsLoading(false);
      }
    },
    onError: (error: any) => {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout process');
      setIsLoading(false);
    }
  });

  const handleUpgrade = async () => {
    if (!user?.id || !user?.email) {
      toast.error('Please sign in to upgrade your account');
      return;
    }

    setIsLoading(true);
    
    createCheckoutMutation.mutate({
      userId: user.id,
      email: user.email,
      plan: plan
    });
  };

  if (children) {
    return (
      <div onClick={handleUpgrade} style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}>
        {children}
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Crown className="h-6 w-6 text-yellow-500" />
          Upgrade to {plan === 'premium' ? 'Premium' : 'Pro'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-2">
          <div className="text-2xl font-bold">
            {plan === 'premium' ? '$29.99' : '$19.99'}/month
          </div>
          <div className="text-sm text-gray-600">
            Cancel anytime • Secure payment via Stripe
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Unlimited AI project planning</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Export to Markdown, JSON, CSV</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Inline task editing</span>
          </div>
          {plan === 'premium' && (
            <>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Priority AI processing</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Advanced analytics</span>
              </div>
            </>
          )}
        </div>

        <Button 
          onClick={handleUpgrade}
          disabled={isLoading || createCheckoutMutation.isPending}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
        >
          {isLoading || createCheckoutMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Crown className="h-4 w-4 mr-2" />
              Upgrade Now
            </>
          )}
        </Button>

        <div className="text-xs text-center text-gray-500">
          Powered by Stripe • Your payment info is secure
        </div>
      </CardContent>
    </Card>
  );
}