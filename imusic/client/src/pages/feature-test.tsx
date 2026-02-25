import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { ProFeature, ProBadge, UpgradeButton } from "@/components/subscription/pro-feature";
import { TestSubscription } from "@/components/subscription/test-subscription";
import { Crown, Music, Star, Mic, Headphones, MusicIcon, Trophy } from "lucide-react";

/**
 * This page is used to test subscription features
 */
export default function FeatureTestPage() {
  const { user } = useAuth();
  const { isProUser, subscription } = useSubscription();

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <header className="border-b border-[#333] border-opacity-50 px-4 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/">
            <span className="text-3xl font-['Playfair_Display'] text-purple-400 cursor-pointer">
              DarkNotes
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {isProUser && (
              <div className="flex items-center bg-gradient-to-r from-purple-900 to-purple-700 px-3 py-1 rounded-full text-white text-xs">
                <Crown className="h-3.5 w-3.5 mr-1.5" />
                <span>PRO</span>
              </div>
            )}
            
            <UpgradeButton />
            
            <Link href="/">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Subscription Feature Testing</h1>
          <div className="text-sm text-gray-400">
            Current status: 
            <span className={`ml-2 font-medium ${isProUser ? 'text-purple-400' : 'text-gray-400'}`}>
              {isProUser ? 'Pro Plan' : 'Free Plan'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Examples of feature gating */}
          <div className="space-y-6">
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle>Feature Access Testing</CardTitle>
                <CardDescription className="text-gray-400">
                  Examples of different ways to restrict features to Pro users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Example 1: Button with Pro feature wrapper */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-300">Example 1: Gated Button</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button>Free Feature</Button>
                    
                    <ProFeature featureType="advanced_studio">
                      <Button className="bg-gradient-to-r from-purple-800 to-purple-600 hover:from-purple-700 hover:to-purple-500">
                        <MusicIcon className="h-4 w-4 mr-2" />
                        Advanced Studio Tools
                      </Button>
                    </ProFeature>
                  </div>
                </div>
                
                {/* Example 2: Card with Pro feature wrapper */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-300">Example 2: Gated Content Card</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="bg-[#232323] border-gray-700">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Free Content</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-400">This content is available to all users.</p>
                      </CardContent>
                    </Card>
                    
                    <ProFeature featureType="all_mentors">
                      <Card className="bg-[#232323] border-gray-700">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-base">Premium Content</CardTitle>
                            <ProBadge />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-400">This premium content is only visible to Pro users.</p>
                        </CardContent>
                      </Card>
                    </ProFeature>
                  </div>
                </div>
                
                {/* Example 3: Feature with conditional fallback */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-300">Example 3: Custom Fallback UI</h3>
                  <ProFeature 
                    featureType="all_challenges"
                    fallback={
                      <Card className="bg-[#232323] border-gray-700">
                        <CardContent className="py-6">
                          <div className="flex items-center justify-center flex-col text-center space-y-3">
                            <div className="bg-amber-900/30 p-2 rounded-full">
                              <Star className="h-6 w-6 text-amber-400" />
                            </div>
                            <p className="text-sm text-gray-300">Premium challenges are available with a Pro subscription</p>
                            <Button asChild size="sm" className="bg-gradient-to-r from-amber-700 to-amber-500">
                              <Link href="/subscribe">Upgrade for Access</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    }
                  >
                    <Card className="bg-[#232323] border-gray-700">
                      <CardContent className="py-6">
                        <div className="flex items-center justify-center flex-col text-center space-y-3">
                          <div className="bg-emerald-900/30 p-2 rounded-full">
                            <Trophy className="h-6 w-6 text-emerald-400" />
                          </div>
                          <p className="text-sm text-gray-300">Premium challenges with prizes and industry opportunities</p>
                          <Button size="sm" className="bg-emerald-700">Enter Top Challenge</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </ProFeature>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Subscription testing utilities */}
          <div className="space-y-6">
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle>Subscription Testing Utilities</CardTitle>
                <CardDescription className="text-gray-400">
                  Tools for testing the subscription functionality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TestSubscription />
              </CardContent>
            </Card>
            
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle>Current Subscription Status</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-[#0e0e0e] p-4 rounded-md text-sm overflow-auto max-h-80">
                  {JSON.stringify(subscription, null, 2)}
                </pre>
              </CardContent>
              <CardFooter className="border-t border-gray-800 pt-4">
                <div className="flex space-x-4 w-full">
                  <Button asChild variant="outline" className="flex-1">
                    <Link href="/subscription">Manage Subscription</Link>
                  </Button>
                  <Button asChild className="flex-1 bg-[#332940] hover:bg-[#3D304C]">
                    <Link href="/subscribe">Go to Subscribe Page</Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}