import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { AlertTriangle, ShieldCheck, RefreshCw, Users } from "lucide-react";

export function TestSubscription() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function testSubscriptionAction(endpoint: string, action: string) {
    try {
      setIsLoading(true);
      setSuccessMessage(null);
      
      const response = await apiRequest('POST', `/api/${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`Failed to ${action.toLowerCase()}`);
      }
      
      const data = await response.json();
      
      toast({
        title: "Test Success",
        description: data.message || `Successfully executed: ${action}`,
      });
      
      setSuccessMessage(data.message || `Successfully executed: ${action}`);
      
      // Refresh the page after 1.5 seconds to see changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error: any) {
      toast({
        title: "Test Failed",
        description: error.message || `Failed to ${action.toLowerCase()}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center p-2 bg-amber-900/20 rounded border border-amber-900/30 mb-3">
        <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 shrink-0" />
        <p className="text-xs text-amber-300">
          Use these tools to simulate subscription lifecycle events without requiring actual payments.
        </p>
      </div>
      
      {successMessage && (
        <div className="bg-emerald-900/20 border border-emerald-900/30 p-2 rounded text-sm text-emerald-300 flex items-center">
          <ShieldCheck className="h-4 w-4 mr-2" />
          {successMessage}
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="border-purple-800 bg-purple-900/20 hover:bg-purple-800/30"
          disabled={isLoading}
          onClick={() => testSubscriptionAction('test-subscription-upgrade', 'Upgrade to Pro')}
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <ShieldCheck className="h-4 w-4 mr-2" />
          )}
          Test Pro Upgrade
        </Button>
        
        <Button
          variant="outline"
          className="border-gray-800 bg-gray-900/20 hover:bg-gray-800/30"
          disabled={isLoading}
          onClick={() => testSubscriptionAction('test-subscription-downgrade', 'Downgrade to Free')}
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Users className="h-4 w-4 mr-2" />
          )}
          Test Downgrade
        </Button>
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        Note: These actions simulate subscription changes for testing purposes only.
        They do not interact with Stripe or create real subscriptions.
      </p>
    </div>
  );
}