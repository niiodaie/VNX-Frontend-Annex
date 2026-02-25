import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, Heart, MapPin, Settings, LogOut, Plus, Trash2, Calendar, Plane } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinDate: string;
  travelPreferences: {
    budget: string;
    travelStyle: string;
    favoriteDestinations: string[];
  };
  stats: {
    destinationsExplored: number;
    countriesVisited: number;
    totalTrips: number;
    wishlistItems: number;
  };
}

interface WishlistItem {
  id: string;
  destinationName: string;
  location: string;
  image: string;
  dateAdded: string;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  estimatedCost?: number;
  bestTimeToVisit?: string;
}

interface TravelPlan {
  id: string;
  title: string;
  destinations: string[];
  startDate: string;
  endDate: string;
  budget: number;
  status: 'planning' | 'booked' | 'completed';
  notes: string;
}

export default function UserAccountSystem() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [travelPlans, setTravelPlans] = useState<TravelPlan[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('vnx-user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUserProfile(user);
      setIsLoggedIn(true);
      loadUserData(user.id);
    }
  }, []);

  const loadUserData = (userId: string) => {
    // Simulate loading user data
    const mockWishlist: WishlistItem[] = [
      {
        id: '1',
        destinationName: 'Kyoto, Japan',
        location: 'Japan, Asia',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        dateAdded: '2024-01-15',
        priority: 'high',
        notes: 'Cherry blossom season visit',
        estimatedCost: 3500,
        bestTimeToVisit: 'March-May'
      },
      {
        id: '2',
        destinationName: 'Santorini, Greece',
        location: 'Greece, Europe',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        dateAdded: '2024-02-20',
        priority: 'medium',
        notes: 'Sunset photography trip',
        estimatedCost: 2800,
        bestTimeToVisit: 'April-October'
      }
    ];

    const mockTravelPlans: TravelPlan[] = [
      {
        id: '1',
        title: 'European Summer Adventure',
        destinations: ['Paris', 'Rome', 'Barcelona'],
        startDate: '2024-07-15',
        endDate: '2024-07-28',
        budget: 4500,
        status: 'planning',
        notes: 'Two-week cultural exploration across major European cities'
      }
    ];

    setWishlist(mockWishlist);
    setTravelPlans(mockTravelPlans);
  };

  const handleLogin = (email: string, password: string) => {
    // Simulate login process
    const mockUser: UserProfile = {
      id: 'user123',
      name: 'Alex Thompson',
      email: email,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      joinDate: '2023-06-15',
      travelPreferences: {
        budget: 'mid-range',
        travelStyle: 'cultural-explorer',
        favoriteDestinations: ['Japan', 'Greece', 'Italy']
      },
      stats: {
        destinationsExplored: 23,
        countriesVisited: 12,
        totalTrips: 8,
        wishlistItems: 15
      }
    };

    setUserProfile(mockUser);
    setIsLoggedIn(true);
    setShowLoginModal(false);
    localStorage.setItem('vnx-user', JSON.stringify(mockUser));
    loadUserData(mockUser.id);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserProfile(null);
    setWishlist([]);
    setTravelPlans([]);
    localStorage.removeItem('vnx-user');
  };

  const addToWishlist = (destination: any) => {
    const newItem: WishlistItem = {
      id: Date.now().toString(),
      destinationName: destination.name,
      location: destination.location,
      image: destination.image,
      dateAdded: new Date().toISOString().split('T')[0],
      priority: 'medium',
      notes: '',
      estimatedCost: Math.floor(Math.random() * 3000) + 1000
    };

    setWishlist(prev => [...prev, newItem]);
  };

  const removeFromWishlist = (itemId: string) => {
    setWishlist(prev => prev.filter(item => item.id !== itemId));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'booked': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-2">
        <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Sign In
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Welcome to VNX Explorer</DialogTitle>
            </DialogHeader>
            <LoginForm onLogin={handleLogin} />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 p-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={userProfile?.avatar} />
              <AvatarFallback>{userProfile?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <span className="hidden md:block font-medium">{userProfile?.name}</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>My Travel Dashboard</DialogTitle>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
              <TabsTrigger value="plans">Travel Plans</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={userProfile?.avatar} />
                      <AvatarFallback className="text-lg">
                        {userProfile?.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">{userProfile?.name}</h3>
                      <p className="text-gray-600">{userProfile?.email}</p>
                      <p className="text-sm text-gray-500">
                        Member since {new Date(userProfile?.joinDate || '').toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Travel Budget Preference</Label>
                      <Badge className="mt-1">{userProfile?.travelPreferences.budget}</Badge>
                    </div>
                    <div>
                      <Label>Travel Style</Label>
                      <Badge className="mt-1">{userProfile?.travelPreferences.travelStyle}</Badge>
                    </div>
                  </div>

                  <div>
                    <Label>Favorite Destinations</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {userProfile?.travelPreferences.favoriteDestinations.map((dest, idx) => (
                        <Badge key={idx} variant="outline">{dest}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wishlist" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">My Travel Wishlist</h3>
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Destination
                </Button>
              </div>

              <div className="grid gap-4">
                {wishlist.map(item => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.destinationName}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{item.destinationName}</h4>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {item.location}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Badge className={getPriorityColor(item.priority)}>
                                {item.priority}
                              </Badge>
                              <Button size="sm" variant="ghost" onClick={() => removeFromWishlist(item.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {item.notes && (
                            <p className="text-sm text-gray-700">{item.notes}</p>
                          )}
                          
                          <div className="flex gap-4 text-sm text-gray-600">
                            {item.estimatedCost && (
                              <span>Est. Cost: ${item.estimatedCost}</span>
                            )}
                            {item.bestTimeToVisit && (
                              <span>Best Time: {item.bestTimeToVisit}</span>
                            )}
                            <span>Added: {new Date(item.dateAdded).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="plans" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Travel Plans</h3>
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Plan
                </Button>
              </div>

              <div className="grid gap-4">
                {travelPlans.map(plan => (
                  <Card key={plan.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{plan.title}</h4>
                          <p className="text-sm text-gray-600">
                            {plan.destinations.join(' → ')}
                          </p>
                        </div>
                        <Badge className={getStatusColor(plan.status)}>
                          {plan.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{new Date(plan.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Plane className="w-4 h-4 text-gray-400" />
                          <span>{Math.ceil((new Date(plan.endDate).getTime() - new Date(plan.startDate).getTime()) / (1000 * 60 * 60 * 24))} days</span>
                        </div>
                        <div>
                          <span className="font-medium">${plan.budget.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      {plan.notes && (
                        <p className="text-sm text-gray-700 mt-3">{plan.notes}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="stats" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {userProfile?.stats.destinationsExplored}
                    </div>
                    <div className="text-sm text-gray-600">Destinations Explored</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {userProfile?.stats.countriesVisited}
                    </div>
                    <div className="text-sm text-gray-600">Countries Visited</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {userProfile?.stats.totalTrips}
                    </div>
                    <div className="text-sm text-gray-600">Total Trips</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {userProfile?.stats.wishlistItems}
                    </div>
                    <div className="text-sm text-gray-600">Wishlist Items</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LoginForm({ onLogin }: { onLogin: (email: string, password: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
      </div>

      <Button type="submit" className="w-full">
        {isSignUp ? 'Create Account' : 'Sign In'}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-sm text-blue-600 hover:underline"
        >
          {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </button>
      </div>
    </form>
  );
}