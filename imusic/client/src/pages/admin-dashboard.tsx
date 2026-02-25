import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Calendar, CreditCard, DollarSign, LayoutDashboard, Loader2, Users } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface SubscriptionStats {
  total: number;
  active: number;
  canceled: number;
  revenue: number;
  newSubscriptions: number;
}

interface SubscriberData {
  id: number;
  username: string;
  email: string;
  status: string;
  since: string;
  nextBillingDate?: string;
  revenue: number;
}

// For admin-only use
export default function AdminDashboardPage() {
  const [location, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [subscribers, setSubscribers] = useState<SubscriberData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Redirect non-admin users
  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/auth");
    } else if (!authLoading && user && user.id !== 1) { // Assuming user ID 1 is admin
      setLocation("/home");
    }
  }, [user, authLoading, setLocation]);
  
  // Load demo data for this prototype
  useEffect(() => {
    // This would be an actual API call in production
    const loadAdminData = async () => {
      setIsLoading(true);
      
      try {
        // In a real implementation, these would be API calls:
        // const statsResponse = await apiRequest("GET", "/api/admin/stats");
        // const subscribersResponse = await apiRequest("GET", "/api/admin/subscribers");
        
        // For the prototype, use mock data
        setTimeout(() => {
          setStats({
            total: 58,
            active: 42,
            canceled: 16,
            revenue: 629.58,
            newSubscriptions: 7
          });
          
          setSubscribers([
            {
              id: 2,
              username: "musicproducer",
              email: "producer@example.com",
              status: "active",
              since: "2025-03-15T14:25:00Z",
              nextBillingDate: "2025-05-15T14:25:00Z",
              revenue: 29.98
            },
            {
              id: 3,
              username: "beatmaker",
              email: "beats@example.com",
              status: "active",
              since: "2025-03-20T09:12:00Z",
              nextBillingDate: "2025-05-20T09:12:00Z",
              revenue: 29.98
            },
            {
              id: 4,
              username: "songwriter",
              email: "writer@example.com",
              status: "canceled",
              since: "2025-02-10T11:45:00Z",
              revenue: 14.99
            },
            {
              id: 5,
              username: "vocalisthero",
              email: "vocals@example.com",
              status: "active",
              since: "2025-04-01T16:30:00Z",
              nextBillingDate: "2025-05-01T16:30:00Z",
              revenue: 14.99
            },
            {
              id: 6,
              username: "djmixer",
              email: "dj@example.com",
              status: "active",
              since: "2025-03-28T12:15:00Z",
              nextBillingDate: "2025-04-28T12:15:00Z",
              revenue: 14.99
            }
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error loading admin data:", error);
        setIsLoading(false);
      }
    };
    
    if (user && user.id === 1) {
      loadAdminData();
    }
  }, [user]);
  
  // Format date for display
  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  
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
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/">
            <span className="text-3xl font-['Playfair_Display'] text-purple-400 cursor-pointer">
              DarkNotes
            </span>
          </Link>
          
          <Link href="/">
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              Exit Admin Panel
            </Button>
          </Link>
        </div>
      </header>
      
      <div className="flex min-h-[calc(100vh-76px)]">
        {/* Sidebar */}
        <div className="w-64 border-r border-[#333] border-opacity-50 p-4 hidden md:block">
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start text-left">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start text-left">
              <Users className="h-4 w-4 mr-2" />
              Subscribers
            </Button>
            <Button variant="ghost" className="w-full justify-start text-left">
              <BarChart className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
            
            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="bg-[#1A1A1A] border-gray-800">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-gray-400">Total Revenue</CardDescription>
                    <CardTitle className="text-2xl">${stats.revenue.toFixed(2)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-emerald-400 flex items-center">
                      <DollarSign className="h-3.5 w-3.5 mr-1" />
                      Monthly subscription
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#1A1A1A] border-gray-800">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-gray-400">Active Subscribers</CardDescription>
                    <CardTitle className="text-2xl">{stats.active}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-blue-400 flex items-center">
                      <Users className="h-3.5 w-3.5 mr-1" />
                      Out of {stats.total} total
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#1A1A1A] border-gray-800">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-gray-400">New Subscribers</CardDescription>
                    <CardTitle className="text-2xl">{stats.newSubscriptions}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-purple-400 flex items-center">
                      <CreditCard className="h-3.5 w-3.5 mr-1" />
                      Last 7 days
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#1A1A1A] border-gray-800">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-gray-400">Canceled</CardDescription>
                    <CardTitle className="text-2xl">{stats.canceled}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-amber-400 flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      Total cancelations
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Subscribers Table */}
            <Card className="bg-[#1A1A1A] border-gray-800">
              <CardHeader>
                <CardTitle>Subscribers</CardTitle>
                <CardDescription>
                  Recent subscription activity across the platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="bg-[#232323]">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="canceled">Canceled</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="mt-4">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-xs text-gray-400 bg-[#232323]">
                            <th className="px-4 py-2 text-left">User</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left">Since</th>
                            <th className="px-4 py-2 text-left">Next Bill</th>
                            <th className="px-4 py-2 text-right">Revenue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subscribers.map((sub) => (
                            <tr key={sub.id} className="border-t border-gray-800">
                              <td className="px-4 py-3">
                                <div>
                                  <div className="font-medium">{sub.username}</div>
                                  <div className="text-xs text-gray-400">{sub.email}</div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
                                  sub.status === 'active' 
                                    ? 'bg-emerald-900/30 text-emerald-400' 
                                    : 'bg-amber-900/30 text-amber-400'
                                }`}>
                                  {sub.status}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {formatDate(sub.since)}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {sub.nextBillingDate ? formatDate(sub.nextBillingDate) : '-'}
                              </td>
                              <td className="px-4 py-3 text-right">
                                ${sub.revenue.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="active" className="mt-4">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-xs text-gray-400 bg-[#232323]">
                            <th className="px-4 py-2 text-left">User</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left">Since</th>
                            <th className="px-4 py-2 text-left">Next Bill</th>
                            <th className="px-4 py-2 text-right">Revenue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subscribers
                            .filter(sub => sub.status === 'active')
                            .map((sub) => (
                              <tr key={sub.id} className="border-t border-gray-800">
                                <td className="px-4 py-3">
                                  <div>
                                    <div className="font-medium">{sub.username}</div>
                                    <div className="text-xs text-gray-400">{sub.email}</div>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-emerald-900/30 text-emerald-400">
                                    {sub.status}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  {formatDate(sub.since)}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  {sub.nextBillingDate ? formatDate(sub.nextBillingDate) : '-'}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  ${sub.revenue.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="canceled" className="mt-4">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-xs text-gray-400 bg-[#232323]">
                            <th className="px-4 py-2 text-left">User</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left">Since</th>
                            <th className="px-4 py-2 text-left">Next Bill</th>
                            <th className="px-4 py-2 text-right">Revenue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subscribers
                            .filter(sub => sub.status === 'canceled')
                            .map((sub) => (
                              <tr key={sub.id} className="border-t border-gray-800">
                                <td className="px-4 py-3">
                                  <div>
                                    <div className="font-medium">{sub.username}</div>
                                    <div className="text-xs text-gray-400">{sub.email}</div>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-amber-900/30 text-amber-400">
                                    {sub.status}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  {formatDate(sub.since)}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  {sub.nextBillingDate ? formatDate(sub.nextBillingDate) : '-'}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  ${sub.revenue.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}