import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "./pages/not-found";
import Footer from "@/components/common/Footer";

// Breathalyzer App pages
import HomeScreen from "./pages/HomeScreen";
import ScanScreen from "./pages/ScanScreen";
import ResultScreen from "./pages/ResultScreen";
import SubscriptionScreen from "./pages/SubscriptionScreen";
import TeenModeScreen from "./pages/TeenModeScreen";
import AuthPage from "./pages/auth-page";

// Import AdBanner
import AdBanner from "@/components/monetization/AdBanner";

function Router() {
  // In a real app, this would come from user state/auth context
  const isPremium = false;
  
  return (
    <div className="min-h-screen flex flex-col">
      {!isPremium && <AdBanner position="top" />}
      <div className="flex-1">
        <Switch>
          <Route path="/" component={HomeScreen} />
          <Route path="/scan" component={ScanScreen} />
          <Route path="/result" component={ResultScreen} />
          <Route path="/subscription" component={SubscriptionScreen} />
          <Route path="/teen-mode" component={TeenModeScreen} />
          <Route path="/auth" component={AuthPage} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
