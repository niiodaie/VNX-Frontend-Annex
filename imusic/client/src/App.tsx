import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { SubscriptionProvider } from "@/hooks/use-subscription";
import { ProtectedRoute } from "@/lib/protected-route";
// Import the overlay disabler to run its code
import "@/lib/disable-overlay";

import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import LandingPage from "@/pages/landing-page";
import MentorPage from "@/pages/mentor-page";
import StudioPage from "@/pages/studio-page";
import InspirationPage from "@/pages/inspiration-page";
import CollabPage from "@/pages/collab-page";
import ChallengesPage from "@/pages/challenges-page";
import MusicLabPage from "@/pages/music-lab-page";
import MuseLabFixed from "@/pages/muse-lab-fixed";
import MuseLabWrapper from "@/pages/muse-lab-wrapper";
import MuseLabSimple from "@/pages/muse-lab-simple";
import MuseLabEnhanced from "@/pages/muse-lab-enhanced";
import MuseSimple from "@/pages/muse-simple";
import SharePage from "@/pages/share-page";
import PublicSharePage from "@/pages/public-share-page";
import EmbedTrackPage from "@/pages/embed-track-page";
import SubscribePage from "@/pages/subscribe";
import SubscribeSuccessPage from "@/pages/subscribe-success";

// New prototype pages
import MentorSelectionPage from "@/pages/mentor-selection-page";
import StudioInterfacePage from "@/pages/studio-interface-page";
import CollabSpacePage from "@/pages/collab-space-page";
import BrandBoardPage from "@/pages/brand-board-page";
import VoiceAuditionPage from "@/pages/voice-audition-page";
import SubscriptionPage from "@/pages/subscription.tsx";
import AdminDashboardPage from "@/pages/admin-dashboard.tsx";
import FeatureTestPage from "@/pages/feature-test";
// @ts-ignore - Ignoring type issues with JSX file
import ImageGenerationTestPage from "@/pages/image-generation-test";
import ResetPasswordPage from "@/pages/reset-password-page";
import NavigationTestPage from "@/pages/navigation-test-page";
import AffiliatesPage from "@/pages/affiliates-page";

// Additional pages for footer and navigation
import AboutPage from "@/pages/about-page";
import PrivacyPage from "@/pages/privacy-page";
import TermsPage from "@/pages/terms-page";
import ContactPage from "@/pages/contact-page";
import EchoLabPage from "@/pages/echolab-page";
import AuditionPage from "@/pages/audition-page";
import CollaborationsPage from "@/pages/collaborations";
import MobileAppPage from "@/pages/mobile-app";
import DiscordSetupPage from "@/pages/discord-setup";
import DiscordCommunityPage from "@/pages/discord-community";
import ArtistDatabasePage from "@/pages/artist-database";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/home" component={HomePage} />
      <Route path="/mentor" component={MentorPage} />
      <ProtectedRoute path="/studio" component={StudioPage} />
      <ProtectedRoute path="/inspiration" component={InspirationPage} />
      <ProtectedRoute path="/collab" component={CollabPage} />
      <ProtectedRoute path="/challenges" component={ChallengesPage} />
      <Route path="/music-lab" component={MusicLabPage} />
      <ProtectedRoute path="/share" component={SharePage} />
      <Route path="/track/:id/embed" component={EmbedTrackPage} />
      <Route path="/track/:id" component={PublicSharePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/reset-password" component={ResetPasswordPage} />
      
      {/* Subscription routes */}
      <ProtectedRoute path="/subscribe" component={SubscribePage} />
      <ProtectedRoute path="/subscribe/success" component={SubscribeSuccessPage} />
      <ProtectedRoute path="/subscription" component={SubscriptionPage} />
      
      {/* Admin routes */}
      <ProtectedRoute path="/admin" component={AdminDashboardPage} />
      
      {/* Testing routes */}
      <ProtectedRoute path="/feature-test" component={FeatureTestPage} />
      <Route path="/image-generation" component={ImageGenerationTestPage} />
      <Route path="/navigation-test" component={NavigationTestPage} />
      
      {/* New prototype pages */}
      <Route path="/select-mentor" component={MentorSelectionPage} />
      <Route path="/change-mentor" component={MentorSelectionPage} />
      <ProtectedRoute path="/studio-interface" component={StudioInterfacePage} />
      <Route path="/collab-space" component={CollabSpacePage} />
      <Route path="/brand-board" component={BrandBoardPage} />
      <Route path="/audition" component={VoiceAuditionPage} />
      <ProtectedRoute path="/mentor-audition" component={AuditionPage} />
      
      {/* Creative Journey Steps routes */}
      <Route path="/lyric-lab" component={MusicLabPage} />
      <Route path="/muse-lab" component={MuseLabFixed} />
      <Route path="/muse-lab-new" component={MuseLabWrapper} />
      <Route path="/muse-lab-simple" component={MuseLabSimple} />
      <Route path="/muse-lab-enhanced" component={MuseLabEnhanced} />
      <Route path="/record-demo" component={StudioPage} />
      <Route path="/collab-zone" component={CollabSpacePage} />
      <Route path="/create-journey" component={NavigationTestPage} />
      
      {/* Footer pages */}
      <Route path="/about" component={AboutPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/contact" component={ContactPage} />
      
      {/* Navigation menu pages */}
      <Route path="/echolab" component={EchoLabPage} />
      <Route path="/affiliates" component={AffiliatesPage} />
      <Route path="/mentor-selection" component={MentorSelectionPage} />
      <Route path="/collaborations" component={CollaborationsPage} />
      <Route path="/mobile-app" component={MobileAppPage} />
      <Route path="/discord-setup" component={DiscordCommunityPage} /> {/* Redirected to community page */}
      <Route path="/discord-community" component={DiscordCommunityPage} />
      <ProtectedRoute path="/artist-database" component={ArtistDatabasePage} />
      
      {/* Explicit MuseLab Routes */}
      <Route path="/music-mentor-viusmedia.replit.app/muse-lab-simple" component={MuseLabSimple} />
      <Route path="/muse-simple" component={MuseSimple} />
      
      {/* Music Production Tool Routes */}
      <Route path="/music-tutorials" component={MuseLabSimple} />
      <Route path="/sound-design" component={MuseLabSimple} />
      <Route path="/melody-ai" component={MuseLabSimple} />
      <Route path="/genre-matcher" component={MuseLabSimple} />
      <Route path="/daw-integration" component={MuseLabSimple} />
      
      {/* 404 Catch-all */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SubscriptionProvider>
          <Router />
          <Toaster />
        </SubscriptionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
