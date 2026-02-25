import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Check } from 'lucide-react';

export default function SubscriptionScreen() {
  const [, setLocation] = useLocation();

  const handleGoBack = () => {
    setLocation('/');
  };

  const handleSubscribe = () => {
    alert('Subscription successful! You are now a premium member.');
    setLocation('/');
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-8 text-fogwhite">
      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleGoBack}
            className="text-breathteal hover:text-breathteal/80 hover:bg-midnight mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-breathteal text-center flex-1 pr-7">Go Premium</h1>
        </div>
        
        <Card className="border-breathteal/30 bg-midnight">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold text-center text-breathteal">BreathCheck+</CardTitle>
            <CardDescription className="text-center text-coolgray text-lg">$4.99/month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <p className="text-fogwhite flex items-center gap-2">
              <span className="flex-shrink-0 h-5 w-5 rounded-full bg-breathteal/20 flex items-center justify-center text-breathteal">
                <Check className="h-3.5 w-3.5" />
              </span>
              <span>Instant BAC alerts</span>
            </p>
            <p className="text-fogwhite flex items-center gap-2">
              <span className="flex-shrink-0 h-5 w-5 rounded-full bg-breathteal/20 flex items-center justify-center text-breathteal">
                <Check className="h-3.5 w-3.5" />
              </span>
              <span>Emergency ride assistance</span>
            </p>
            <p className="text-fogwhite flex items-center gap-2">
              <span className="flex-shrink-0 h-5 w-5 rounded-full bg-breathteal/20 flex items-center justify-center text-breathteal">
                <Check className="h-3.5 w-3.5" />
              </span>
              <span>Discounts with Uber/Lyft</span>
            </p>
            <p className="text-fogwhite flex items-center gap-2">
              <span className="flex-shrink-0 h-5 w-5 rounded-full bg-breathteal/20 flex items-center justify-center text-breathteal">
                <Check className="h-3.5 w-3.5" />
              </span>
              <span>AI-driven coaching</span>
            </p>
            <p className="text-fogwhite flex items-center gap-2">
              <span className="flex-shrink-0 h-5 w-5 rounded-full bg-breathteal/20 flex items-center justify-center text-breathteal">
                <Check className="h-3.5 w-3.5" />
              </span>
              <span>Ad-free experience</span>
            </p>
            <p className="text-fogwhite flex items-center gap-2">
              <span className="flex-shrink-0 h-5 w-5 rounded-full bg-breathteal/20 flex items-center justify-center text-breathteal">
                <Check className="h-3.5 w-3.5" />
              </span>
              <span>Premium insurance connections</span>
            </p>
          </CardContent>
        </Card>
        
        <div className="space-y-3 mt-4">
          <Button 
            onClick={handleSubscribe} 
            className="w-full py-6 bg-breathteal hover:bg-breathteal/90 text-midnight font-medium text-lg"
          >
            Subscribe Now
          </Button>
          
          <Button 
            variant="ghost"
            onClick={handleGoBack}
            className="w-full text-coolgray hover:text-fogwhite hover:bg-transparent"
          >
            Maybe Later
          </Button>
        </div>
        
        <div className="text-center text-xs text-coolgray mt-6">
          <p>Your subscription will automatically renew. You can cancel anytime.</p>
          <p className="mt-2">Powered by Visnec</p>
        </div>
      </div>
    </div>
  );
}