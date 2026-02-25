import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Crown, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'wouter';
import { useAuth } from '@/components/AuthProvider';
import { apiRequest } from '@/lib/queryClient';

export default function UpgradeSuccess() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'canceled' | 'processing'>('processing');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const canceled = urlParams.get('canceled');
    const sessionId = urlParams.get('session_id');

    if (success === 'true') {
      setPaymentStatus('success');
      // Payment successful - user subscription will be updated via webhook
    } else if (canceled === 'true') {
      setPaymentStatus('canceled');
    }

    setIsLoading(false);

    // Track analytics event
    if (success === 'true') {
      // Track successful upgrade
      console.log('Subscription upgraded successfully');
    }
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-12 flex justify-center">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Processing your payment...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (paymentStatus === 'canceled') {
    return (
      <Layout>
        <div className="container mx-auto py-12 max-w-2xl">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Payment Canceled</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600">
                Your payment was canceled. No charges were made to your account.
              </p>
              <div className="space-y-3">
                <Link href="/upgrade">
                  <Button className="w-full">
                    <Crown className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full">
                    Return to Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-12 max-w-2xl">
        <Card className="text-center border-green-200 bg-green-50">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">
              Welcome to Premium!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-green-700 mb-4">
                🎉 Your subscription has been activated successfully!
              </p>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">
                  You now have access to:
                </h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>✓ Unlimited AI project planning</li>
                  <li>✓ Export to Markdown, JSON, and CSV</li>
                  <li>✓ Inline task editing and management</li>
                  <li>✓ Advanced analytics and insights</li>
                  <li>✓ Priority customer support</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/project-planning">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Crown className="h-4 w-4 mr-2" />
                  Start AI Planning
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full border-green-300 text-green-700">
                  Go to Dashboard
                </Button>
              </Link>
            </div>

            <div className="text-xs text-gray-500 border-t pt-4">
              <p>
                Questions? Contact us at support@visnec.com
              </p>
              <p className="mt-1">
                You can manage your subscription anytime in your account settings.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}