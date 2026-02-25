import React from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/context/AuthContext";

// Import components
import Header from "./components/Header";
import Footer from "./components/Footer";
import MobileNavBar from "./components/MobileNavBar";
import { Toaster } from "./components/ui/toaster";

// Import pages
import NotFound from "./pages/NotFound";
import DirectoryPage from "./pages/DirectoryPage";
import RestaurantsPage from "./pages/RestaurantsPage";
import RestaurantDetailPage from "./pages/RestaurantDetailPage";
import RestaurantSearchPage from "./pages/RestaurantSearchPage";
import CuisinesPage from "./pages/CuisinesPage";
import CulturalInsightsPage from "./pages/CulturalInsightsPage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import CuisineGalleryPage from "./pages/CuisineGalleryPage";

// Placeholder pages that will be implemented later
const About = () => <div className="container mx-auto px-4 py-16"><h1 className="text-3xl font-bold mb-6">About Us</h1><p>This page is under construction.</p></div>;
const RegisterRestaurant = () => <div className="container mx-auto px-4 py-16"><h1 className="text-3xl font-bold mb-6">Register Your Restaurant</h1><p>This page is under construction.</p></div>;
const RestaurantDashboard = () => <div className="container mx-auto px-4 py-16"><h1 className="text-3xl font-bold mb-6">Restaurant Dashboard</h1><p>This page is under construction.</p></div>;


function Router() {
  return (
    <Switch>
      <Route path="/" component={CuisinesPage} />
      <Route path="/cuisines" component={CuisinesPage} />
      
      {/* New unified restaurant search page */}
      <Route path="/find-restaurants" component={RestaurantSearchPage} />
      
      {/* Keep legacy routes with redirects for compatibility */}
      <Route path="/restaurants" component={RestaurantSearchPage} />
      <Route path="/directory" component={RestaurantSearchPage} />
      
      <Route path="/restaurant/:id" component={RestaurantDetailPage} />
      <Route path="/cultural-insights" component={CulturalInsightsPage} />
      <Route path="/cuisine-gallery" component={CuisineGalleryPage} />

      <Route path="/about" component={About} />
      <Route path="/register-restaurant" component={RegisterRestaurant} />
      <Route path="/restaurant-dashboard" component={RestaurantDashboard} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
          <MobileNavBar />
          <Toaster />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;