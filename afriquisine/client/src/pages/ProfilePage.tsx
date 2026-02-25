import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  User, 
  Calendar, 
  Star, 
  Heart, 
  Settings, 
  MapPin,
  Clock,
  Edit,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Bell
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types
interface UserProfile {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  createdAt: string;
  preferences?: {
    favoriteRegions?: string[];
    dietaryRestrictions?: string[];
    spiceLevel?: string;
    notifications?: boolean;
  };
}

interface Reservation {
  id: number;
  restaurantId: number;
  userId: number;
  date: string;
  partySize: number;
  status: string;
  specialRequests?: string;
  createdAt: string;
  restaurant?: {
    name: string;
    address?: string;
    cuisineType: string;
    imageUrl?: string;
  };
}

interface Review {
  id: number;
  restaurantId: number;
  userId: number;
  rating: number;
  comment?: string;
  createdAt: string;
  restaurant?: {
    name: string;
    cuisineType: string;
    imageUrl?: string;
  };
}

interface FavoriteRestaurant {
  id: number;
  restaurant: {
    id: number;
    name: string;
    cuisineType: string;
    address?: string;
    imageUrl?: string;
    rating?: number;
  };
  addedAt: string;
}

export default function ProfilePage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [cancelReservationId, setCancelReservationId] = useState<number | null>(null);

  // Example hard-coded user ID - in a real app, this would come from auth state
  const userId = 1;

  // Fetch user profile
  const { 
    data: profile, 
    isLoading: profileLoading, 
    error: profileError,
    refetch: refetchProfile
  } = useQuery({
    queryKey: [`/api/users/${userId}`],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch user profile: ${response.statusText}`);
        }
        const userData = await response.json();
        return userData as UserProfile;
      } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
      }
    }
  });

  // Fetch user reservations
  const {
    data: reservations,
    isLoading: reservationsLoading,
    error: reservationsError,
    refetch: refetchReservations
  } = useQuery({
    queryKey: [`/api/users/${userId}/reservations`],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/users/${userId}/reservations`);
        if (!response.ok) {
          throw new Error("Failed to fetch reservations");
        }
        const data = await response.json();
        
        // For now, we'll add some example restaurant data
        return data.reservations.map((res: any) => ({
          ...res,
          restaurant: {
            name: res.restaurantId === 1 ? "Taste of Lagos" : 
                  res.restaurantId === 2 ? "Cairo Kitchen" : 
                  res.restaurantId === 3 ? "Marrakesh Express" : "African Restaurant",
            cuisineType: res.restaurantId === 1 ? "Nigerian" : 
                         res.restaurantId === 2 ? "Egyptian" : 
                         res.restaurantId === 3 ? "Moroccan" : "African",
            address: "123 Main St, City"
          }
        }));
      } catch (error) {
        console.error("Error fetching reservations:", error);
        throw error;
      }
    }
  });

  // Fetch user reviews
  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    error: reviewsError
  } = useQuery({
    queryKey: [`/api/users/${userId}/reviews`],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/users/${userId}/reviews`);
        if (!response.ok) {
          throw new Error(`Failed to fetch reviews: ${response.statusText}`);
        }
        return await response.json();
      } catch (error) {
        console.error("Error fetching reviews:", error);
        throw error;
      }
    }
  });
  
  // Extract reviews from the response
  const reviews = reviewsData?.reviews || [];

  // Fetch user favorite restaurants
  const {
    data: favoritesData,
    isLoading: favoritesLoading,
    error: favoritesError
  } = useQuery({
    queryKey: [`/api/users/${userId}/favorites`],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/users/${userId}/favorites`);
        if (!response.ok) {
          throw new Error(`Failed to fetch favorites: ${response.statusText}`);
        }
        return await response.json();
      } catch (error) {
        console.error("Error fetching favorite restaurants:", error);
        throw error;
      }
    }
  });
  
  // Extract favorites from the response
  const favorites = favoritesData?.favorites || [];

  // Handle profile edit
  const handleEditProfile = () => {
    if (profile) {
      setEditedProfile({ ...profile });
      setIsEditing(true);
    }
  };

  const handleSaveProfile = async () => {
    if (!editedProfile) return;
    
    try {
      // In a real app, this would call an API endpoint to update the profile
      // For now, we'll just simulate a successful update
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
        variant: "default",
      });
      
      setIsEditing(false);
      // Optimistically update local state
      refetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle reservation cancellation
  const handleCancelReservation = async () => {
    if (!cancelReservationId) return;
    
    try {
      // In a real app, this would call an API endpoint to cancel the reservation
      // For now, we'll just simulate a successful cancellation
      
      toast({
        title: "Reservation Cancelled",
        description: "Your reservation has been cancelled successfully.",
        variant: "default",
      });
      
      setCancelReservationId(null);
      // Optimistically update local state
      refetchReservations();
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      toast({
        title: "Cancellation Failed",
        description: "Failed to cancel reservation. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Loading state
  if (profileLoading || reservationsLoading || reviewsLoading || favoritesLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (profileError || reservationsError || reviewsError || favoritesError) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Error Loading Profile</h2>
            <p className="text-gray-600 mb-4">We couldn't load your profile information. Please try again later.</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get status badge properties
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return { color: 'bg-green-100 text-green-800', icon: <CheckCircle2 className="h-3 w-3 mr-1" /> };
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-3 w-3 mr-1" /> };
      case 'cancelled':
        return { color: 'bg-red-100 text-red-800', icon: <XCircle className="h-3 w-3 mr-1" /> };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: <AlertCircle className="h-3 w-3 mr-1" /> };
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* User Profile Card */}
        <Card className="md:w-1/3">
          <CardContent className="p-6 flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src="/images/users/avatar.jpg" alt={profile?.fullName} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                {profile?.fullName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <h2 className="text-2xl font-bold">{profile?.fullName}</h2>
            <p className="text-gray-500 mb-2">@{profile?.username}</p>
            
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Member since {profile ? new Date(profile.createdAt).toLocaleDateString() : ''}</span>
            </div>
            
            <Button onClick={handleEditProfile} className="w-full mb-2">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            
            <Link href="/settings">
              <Button variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        {/* Stats and Activity */}
        <Card className="md:w-2/3">
          <CardHeader>
            <CardTitle>Your African Cuisine Journey</CardTitle>
            <CardDescription>Track your reservations, reviews, and exploration of African cuisine</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="bg-primary/10 rounded-full p-3 mb-2">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">{reservations?.length || 0}</div>
                  <div className="text-sm text-gray-500">Reservations</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="bg-primary/10 rounded-full p-3 mb-2">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">{reviews?.length || 0}</div>
                  <div className="text-sm text-gray-500">Reviews</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="bg-primary/10 rounded-full p-3 mb-2">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">{favorites?.length || 0}</div>
                  <div className="text-sm text-gray-500">Favorites</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-2">Food Preferences</h3>
              <div className="flex flex-wrap gap-2">
                {profile?.preferences?.favoriteRegions?.map((region, index) => (
                  <Badge key={index} variant="outline" className="bg-orange-50 text-orange-800 border-orange-200">
                    <MapPin className="h-3 w-3 mr-1" /> {region}
                  </Badge>
                ))}
                
                {profile?.preferences?.dietaryRestrictions?.map((restriction, index) => (
                  <Badge key={index} variant="outline" className="bg-green-50 text-green-800 border-green-200">
                    {restriction}
                  </Badge>
                ))}
                
                {profile?.preferences?.spiceLevel && (
                  <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">
                    {profile.preferences.spiceLevel} Spice
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for Profile Sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-10">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile Info</TabsTrigger>
          <TabsTrigger value="reservations">Reservations</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        
        {/* Profile Info Tab */}
        <TabsContent value="profile" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Manage your personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName"
                        value={editedProfile?.fullName || ''} 
                        onChange={(e) => setEditedProfile(prev => prev ? { ...prev, fullName: e.target.value } : null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username"
                        value={editedProfile?.username || ''} 
                        onChange={(e) => setEditedProfile(prev => prev ? { ...prev, username: e.target.value } : null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        type="email"
                        value={editedProfile?.email || ''} 
                        onChange={(e) => setEditedProfile(prev => prev ? { ...prev, email: e.target.value } : null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input 
                        id="phoneNumber"
                        value={editedProfile?.phoneNumber || ''} 
                        onChange={(e) => setEditedProfile(prev => prev ? { ...prev, phoneNumber: e.target.value } : null)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Favorite African Cuisines</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['West African', 'North African', 'East African', 'South African', 'Central African'].map((region) => {
                        const isSelected = editedProfile?.preferences?.favoriteRegions?.includes(region);
                        return (
                          <Badge 
                            key={region}
                            variant={isSelected ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => {
                              setEditedProfile(prev => {
                                if (!prev) return prev;
                                
                                const currentRegions = prev.preferences?.favoriteRegions || [];
                                const updatedRegions = isSelected
                                  ? currentRegions.filter(r => r !== region)
                                  : [...currentRegions, region];
                                
                                return {
                                  ...prev,
                                  preferences: {
                                    ...(prev.preferences || {}),
                                    favoriteRegions: updatedRegions
                                  }
                                };
                              });
                            }}
                          >
                            {region}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Dietary Preferences</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['Vegetarian options', 'Vegan options', 'Halal', 'Gluten-free', 'Dairy-free'].map((restriction) => {
                        const isSelected = editedProfile?.preferences?.dietaryRestrictions?.includes(restriction);
                        return (
                          <Badge 
                            key={restriction}
                            variant={isSelected ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => {
                              setEditedProfile(prev => {
                                if (!prev) return prev;
                                
                                const currentRestrictions = prev.preferences?.dietaryRestrictions || [];
                                const updatedRestrictions = isSelected
                                  ? currentRestrictions.filter(r => r !== restriction)
                                  : [...currentRestrictions, restriction];
                                
                                return {
                                  ...prev,
                                  preferences: {
                                    ...(prev.preferences || {}),
                                    dietaryRestrictions: updatedRestrictions
                                  }
                                };
                              });
                            }}
                          >
                            {restriction}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="spiceLevel">Preferred Spice Level</Label>
                    <Select 
                      value={editedProfile?.preferences?.spiceLevel || 'Medium'} 
                      onValueChange={(value: string) => {
                        setEditedProfile(prev => {
                          if (!prev) return prev;
                          return {
                            ...prev,
                            preferences: {
                              ...(prev.preferences || {}),
                              spiceLevel: value
                            }
                          };
                        });
                      }}
                    >
                      <SelectTrigger id="spiceLevel">
                        <SelectValue placeholder="Select spice level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mild">Mild</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hot">Hot</SelectItem>
                        <SelectItem value="Very Hot">Very Hot</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="notifications" className="flex-1">
                      Receive email notifications about new restaurants and offers
                    </Label>
                    <input
                      type="checkbox"
                      id="notifications"
                      checked={editedProfile?.preferences?.notifications || false}
                      onChange={(e) => {
                        setEditedProfile(prev => {
                          if (!prev) return prev;
                          return {
                            ...prev,
                            preferences: {
                              ...(prev.preferences || {}),
                              notifications: e.target.checked
                            }
                          };
                        });
                      }}
                      className="h-4 w-4"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                      <p>{profile?.fullName}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Username</h3>
                      <p>@{profile?.username}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p>{profile?.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                      <p>{profile?.phoneNumber || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Favorite African Cuisines</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profile?.preferences?.favoriteRegions?.map((region, index) => (
                        <Badge key={index} variant="outline" className="bg-orange-50 text-orange-800 border-orange-200">
                          {region}
                        </Badge>
                      ))}
                      {(!profile?.preferences?.favoriteRegions || profile.preferences.favoriteRegions.length === 0) && (
                        <p className="text-gray-500 text-sm">No favorite cuisines selected</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Dietary Preferences</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profile?.preferences?.dietaryRestrictions?.map((restriction, index) => (
                        <Badge key={index} variant="outline" className="bg-green-50 text-green-800 border-green-200">
                          {restriction}
                        </Badge>
                      ))}
                      {(!profile?.preferences?.dietaryRestrictions || profile.preferences.dietaryRestrictions.length === 0) && (
                        <p className="text-gray-500 text-sm">No dietary preferences specified</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Preferred Spice Level</h3>
                    <p>{profile?.preferences?.spiceLevel || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Notifications</h3>
                    <p>
                      {profile?.preferences?.notifications
                        ? 'You will receive email notifications about new restaurants and offers'
                        : 'You have opted out of email notifications'}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="mr-2">
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={handleEditProfile}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Reservations Tab */}
        <TabsContent value="reservations" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Reservations</CardTitle>
              <CardDescription>Manage your restaurant reservations</CardDescription>
            </CardHeader>
            <CardContent>
              {reservations && reservations.length > 0 ? (
                <div className="space-y-4">
                  {reservations.map((reservation: Reservation) => {
                    const statusBadge = getStatusBadge(reservation.status);
                    const isUpcoming = new Date(reservation.date) > new Date();
                    
                    return (
                      <Card key={reservation.id} className="overflow-hidden">
                        <div className="p-4 flex flex-col md:flex-row gap-4">
                          <div className="md:w-1/4 flex flex-col">
                            <h3 className="font-bold text-lg">{reservation.restaurant?.name}</h3>
                            <p className="text-sm text-gray-500">{reservation.restaurant?.cuisineType} Cuisine</p>
                            <div className="mt-2 flex items-center">
                              <span className={`px-2 py-1 rounded-full text-xs flex items-center ${statusBadge.color}`}>
                                {statusBadge.icon} {reservation.status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="md:w-2/4">
                            <div className="flex items-center mb-1">
                              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{format(new Date(reservation.date), 'EEEE, MMMM d, yyyy')}</span>
                            </div>
                            <div className="flex items-center mb-1">
                              <Clock className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{format(new Date(reservation.date), 'h:mm a')}</span>
                            </div>
                            <div className="flex items-center mb-1">
                              <User className="h-4 w-4 mr-2 text-gray-500" />
                              <span>Party of {reservation.partySize}</span>
                            </div>
                            {reservation.specialRequests && (
                              <p className="text-sm text-gray-600 mt-2">
                                <span className="font-medium">Special Requests:</span> {reservation.specialRequests}
                              </p>
                            )}
                          </div>
                          
                          <div className="md:w-1/4 flex flex-col justify-center items-end space-y-2">
                            <Button variant="outline" size="sm" onClick={() => setSelectedReservation(reservation)}>
                              View Details
                            </Button>
                            
                            {isUpcoming && reservation.status.toLowerCase() !== 'cancelled' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-red-200 text-red-800 hover:bg-red-50"
                                onClick={() => setCancelReservationId(reservation.id)}
                              >
                                Cancel Reservation
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Reservations Yet</h3>
                  <p className="text-gray-500 mb-4">You haven't made any reservations at African restaurants yet.</p>
                  <Link href="/restaurants">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Find a Restaurant
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Reviews Tab */}
        <TabsContent value="reviews" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Reviews</CardTitle>
              <CardDescription>Reviews you've left for African restaurants</CardDescription>
            </CardHeader>
            <CardContent>
              {reviews && reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review: Review) => (
                    <Card key={review.id} className="overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-lg">{review.restaurant?.name}</h3>
                            <p className="text-sm text-gray-500">{review.restaurant?.cuisineType} Cuisine</p>
                          </div>
                          <div className="flex items-center bg-amber-50 text-amber-800 px-3 py-1 rounded-full">
                            <Star className="h-4 w-4 fill-amber-500 text-amber-500 mr-1" />
                            <span className="font-medium">{review.rating}</span>
                          </div>
                        </div>
                        
                        <div className="mb-2">
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>{format(new Date(review.createdAt), 'MMMM d, yyyy')}</span>
                          
                          <div className="flex space-x-2">
                            <Link href={`/restaurant/${review.restaurantId}`}>
                              <Button variant="ghost" size="sm" className="h-8">
                                Visit Restaurant
                              </Button>
                            </Link>
                            <Button variant="ghost" size="sm" className="h-8">
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Reviews Yet</h3>
                  <p className="text-gray-500 mb-4">You haven't reviewed any African restaurants yet.</p>
                  <Link href="/restaurants">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Find Restaurants to Review
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Favorites Tab */}
        <TabsContent value="favorites" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Favorite Restaurants</CardTitle>
              <CardDescription>African restaurants you've saved as favorites</CardDescription>
            </CardHeader>
            <CardContent>
              {favorites && favorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favorites.map((favorite: FavoriteRestaurant) => (
                    <Card key={favorite.id} className="overflow-hidden">
                      <div className="h-40 w-full bg-gray-200 relative">
                        {favorite.restaurant.imageUrl ? (
                          <img
                            src={favorite.restaurant.imageUrl}
                            alt={favorite.restaurant.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-orange-400 to-amber-600">
                            <span className="text-white font-bold text-xl">{favorite.restaurant.name.charAt(0)}</span>
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 rounded-full bg-white hover:bg-red-50 border-none"
                          >
                            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg truncate">{favorite.restaurant.name}</h3>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="truncate">{favorite.restaurant.address || 'Address not available'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Badge className="mr-2 bg-amber-50 text-amber-800 border-amber-200">
                              {favorite.restaurant.cuisineType}
                            </Badge>
                            {favorite.restaurant.rating && (
                              <div className="flex items-center text-amber-500">
                                <Star className="h-4 w-4 fill-amber-500 mr-1" />
                                <span>{favorite.restaurant.rating}</span>
                              </div>
                            )}
                          </div>
                          <Link href={`/restaurant/${favorite.restaurant.id}`}>
                            <Button variant="ghost" size="sm">
                              Visit
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Favorites Yet</h3>
                  <p className="text-gray-500 mb-4">You haven't saved any African restaurants as favorites yet.</p>
                  <Link href="/restaurants">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Explore Restaurants
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Reservation Details Dialog */}
      <Dialog open={!!selectedReservation} onOpenChange={(open) => !open && setSelectedReservation(null)}>
        {selectedReservation && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Reservation Details</DialogTitle>
              <DialogDescription>
                {selectedReservation.restaurant?.name} • {format(new Date(selectedReservation.date), 'MMMM d, yyyy')}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                <div className="flex items-center">
                  <span className={`px-2 py-1 rounded-full text-xs flex items-center ${getStatusBadge(selectedReservation.status).color}`}>
                    {getStatusBadge(selectedReservation.status).icon} {selectedReservation.status}
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Restaurant</h3>
                <p>{selectedReservation.restaurant?.name}</p>
                <p className="text-sm text-gray-500">{selectedReservation.restaurant?.cuisineType} Cuisine</p>
                {selectedReservation.restaurant?.address && (
                  <p className="text-sm text-gray-500">{selectedReservation.restaurant.address}</p>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Date & Time</h3>
                <p>{format(new Date(selectedReservation.date), 'EEEE, MMMM d, yyyy')}</p>
                <p>{format(new Date(selectedReservation.date), 'h:mm a')}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Party Size</h3>
                <p>{selectedReservation.partySize} {selectedReservation.partySize === 1 ? 'person' : 'people'}</p>
              </div>
              
              {selectedReservation.specialRequests && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Special Requests</h3>
                  <p>{selectedReservation.specialRequests}</p>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Reservation Made</h3>
                <p>{format(new Date(selectedReservation.createdAt), 'MMMM d, yyyy')}</p>
              </div>
            </div>
            
            <DialogFooter className="flex gap-2 justify-between items-center">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              
              {new Date(selectedReservation.date) > new Date() && selectedReservation.status.toLowerCase() !== 'cancelled' && (
                <Button 
                  variant="outline"
                  className="border-red-200 text-red-800 hover:bg-red-50"
                  onClick={() => {
                    setSelectedReservation(null);
                    setCancelReservationId(selectedReservation.id);
                  }}
                >
                  Cancel Reservation
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
      
      {/* Cancel Reservation Dialog */}
      <Dialog open={!!cancelReservationId} onOpenChange={(open) => !open && setCancelReservationId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Reservation</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this reservation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setCancelReservationId(null)}>
              Keep Reservation
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancelReservation}
            >
              Yes, Cancel Reservation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}