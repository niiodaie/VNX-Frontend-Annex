import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Lock, ShieldAlert, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function TeenModeScreen() {
  const [, setLocation] = useLocation();
  const [bac, setBac] = useState('');
  const [parentCode, setParentCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoBack = () => {
    setLocation('/');
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    if (parentCode !== '1234') {
      setError('Please enter the correct parental PIN.');
      setIsLoading(false);
      return;
    }
    
    const parsed = parseFloat(bac);
    if (isNaN(parsed)) {
      setError('Enter a valid BAC value.');
      setIsLoading(false);
    } else if (parsed > 0.00) {
      try {
        const response = await fetch('/api/notify-parent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bac: parsed, status: 'fail', teenId: 'teen123' })
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        setError('You should not be driving. Alert sent to parent.');
      } catch (error) {
        console.error('Failed to notify parent:', error);
        setError('Failed to notify parent. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const response = await fetch('/api/notify-parent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bac: parsed, status: 'pass', teenId: 'teen123' })
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        setSuccess('Drive safe! Parent notified.');
      } catch (error) {
        console.error('Failed to notify parent:', error);
        setError('Failed to notify parent. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
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
          <h1 className="text-2xl font-bold text-breathteal text-center flex-1 pr-7">Teen Driver Check</h1>
        </div>
        
        <Card className="border-midnight bg-carbon">
          <CardHeader className="bg-midnight pb-4 border-b border-midnight">
            <CardTitle className="text-fogwhite flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-breathteal" />
              <span>Teen Safety Mode</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-5">
            <div className="space-y-2">
              <p className="text-sm text-coolgray">Enter BAC result from your teen's test</p>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={bac}
                onChange={(e) => setBac(e.target.value)}
                className="bg-midnight border-breathteal/30 text-fogwhite focus:border-breathteal"
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-coolgray flex items-center gap-1">
                <Lock className="h-4 w-4 text-breathteal" />
                <span>Parental PIN</span>
              </p>
              <Input
                type="password"
                placeholder="Enter 4-digit PIN"
                maxLength={4}
                value={parentCode}
                onChange={(e) => setParentCode(e.target.value)}
                className="bg-midnight border-breathteal/30 text-fogwhite focus:border-breathteal"
              />
              <p className="text-xs text-coolgray italic">Default PIN: 1234</p>
            </div>
            
            {error && (
              <div className="p-3 rounded bg-crimson/20 border border-crimson/30 text-sm text-crimson">
                {error}
              </div>
            )}
            
            {success && (
              <div className="p-3 rounded bg-signalmint/20 border border-signalmint/30 text-sm text-signalmint">
                {success}
              </div>
            )}
            
            <Button 
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full mt-4 bg-breathteal hover:bg-breathteal/90 text-midnight font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Notifying parent...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </CardContent>
        </Card>
        
        <div className="p-4 rounded bg-midnight text-sm text-coolgray">
          <h3 className="font-medium text-breathteal mb-2">About Teen Mode</h3>
          <p>This feature helps parents monitor their teen driver's sobriety and safety. Each test result is shared with the parent's registered contact information. Parents will be alerted if any alcohol is detected.</p>
        </div>
      </div>
    </div>
  );
}