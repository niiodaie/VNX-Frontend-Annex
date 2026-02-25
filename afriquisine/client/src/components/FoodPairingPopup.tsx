import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Check, X, Coffee, Utensils, Cake, Wine } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface FoodPairing {
  dish: string;
  pairings: {
    name: string;
    description: string;
    compatibilityScore: number;
    type: 'drink' | 'side' | 'dessert' | 'appetizer';
  }[];
  reasoning: string;
}

interface FoodPairingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  dishName: string;
  cuisine?: string;
}

export default function FoodPairingPopup({ isOpen, onClose, dishName, cuisine }: FoodPairingPopupProps) {
  const [pairingData, setPairingData] = useState<FoodPairing | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPairingData = async () => {
    if (!dishName) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the GET endpoint with dish name as path parameter
      const response = await apiRequest('GET', `/api/food-pairings/${encodeURIComponent(dishName)}${cuisine ? `?cuisine=${encodeURIComponent(cuisine)}` : ''}`);
      const data = await response.json();
      
      if (data.pairingSuggestions) {
        setPairingData(data.pairingSuggestions);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching food pairings:', err);
      setError('Failed to get pairing suggestions. Please try again later.');
      toast({
        title: 'Error',
        description: 'Could not retrieve pairing suggestions',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch pairing data when the popup opens
  React.useEffect(() => {
    if (isOpen && dishName && !pairingData && !isLoading) {
      fetchPairingData();
    }
    
    // Clear data when popup closes
    if (!isOpen) {
      setPairingData(null);
      setError(null);
    }
  }, [isOpen, dishName]);

  // Helper function to get icon for pairing type
  const getPairingIcon = (type: string) => {
    switch (type) {
      case 'drink':
        return <Coffee className="h-5 w-5 text-blue-500" />;
      case 'side':
        return <Utensils className="h-5 w-5 text-green-500" />;
      case 'dessert':
        return <Cake className="h-5 w-5 text-pink-500" />;
      case 'appetizer':
        return <Utensils className="h-5 w-5 text-orange-500" />;
      default:
        return <Utensils className="h-5 w-5 text-gray-500" />;
    }
  };

  // Function to get color based on compatibility score
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-orange-500';
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Perfect Pairings for {dishName}
          </DialogTitle>
          <DialogDescription>
            AI-powered suggestions for complementary foods and drinks
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
              <p className="text-sm text-muted-foreground">Analyzing flavor profiles...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <X className="h-8 w-8 text-destructive mb-3" />
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button variant="outline" onClick={fetchPairingData} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : pairingData ? (
            <div className="space-y-4">
              {/* Pairings List */}
              <div className="space-y-3">
                {pairingData.pairings.map((pairing, index) => (
                  <div key={index} className="border rounded-lg p-3 bg-card">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-muted rounded-md">
                        {getPairingIcon(pairing.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{pairing.name}</h4>
                          <span 
                            className={`text-sm font-medium ${getScoreColor(pairing.compatibilityScore)}`}
                          >
                            {pairing.compatibilityScore}%
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{pairing.description}</p>
                        <span className="inline-block mt-1 text-xs bg-muted rounded px-1.5 py-0.5 capitalize">
                          {pairing.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Reasoning */}
              <div className="bg-muted/50 p-3 rounded-md mt-4">
                <h4 className="text-sm font-medium mb-1">Why these pairings work</h4>
                <p className="text-xs text-muted-foreground">{pairingData.reasoning}</p>
              </div>
            </div>
          ) : null}
        </div>
        
        <DialogFooter className="flex justify-between">
          <span className="text-xs text-muted-foreground">
            Powered by AI
          </span>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}