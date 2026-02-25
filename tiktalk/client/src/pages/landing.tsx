import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import PodcastCard from "@/components/podcast-card";
import AudioPlayer from "@/components/audio-player";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Users, Mic, TrendingUp, Star, Headphones } from "lucide-react";

const categories = [
  { name: "Technology", count: "1,234 shows", icon: "💻", color: "from-blue-500 to-blue-600" },
  { name: "Business", count: "892 shows", icon: "💼", color: "from-green-500 to-green-600" },
  { name: "Health", count: "567 shows", icon: "❤️", color: "from-purple-500 to-purple-600" },
  { name: "Society", count: "743 shows", icon: "👥", color: "from-red-500 to-red-600" },
  { name: "Comedy", count: "456 shows", icon: "😄", color: "from-yellow-500 to-yellow-600" },
  { name: "Education", count: "678 shows", icon: "📚", color: "from-indigo-500 to-indigo-600" },
];

export default function Landing() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: featuredPodcasts, isLoading: featuredLoading } = useQuery({
    queryKey: ["/api/podcasts/featured"],
  });

  const demoEpisode = {
    title: "The Future of AI in Content Creation",
    podcast: "Tech Talk Daily • Episode 42",
    duration: 1800,
    currentTime: 342,
    isPlaying: false,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                The Home of <span className="text-accent">Podcasters</span> and Podcasts
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Create, share, and discover amazing podcasts. Join thousands of creators and millions of listeners in the ultimate podcast community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-accent text-gray-900 hover:bg-yellow-400">
                  <Headphones className="w-5 h-5 mr-2" />
                  Start Listening
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-primary"
                  onClick={() => window.location.href = "/api/login"}
                >
                  <Mic className="w-5 h-5 mr-2" />
                  Create Your Podcast
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Professional podcast studio setup" 
                className="rounded-xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-600 font-medium">12.5K Live Listeners</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Podcasts */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Podcasts</h2>
            <p className="text-lg text-gray-600">Hand-picked shows from our community of creators</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))
            ) : (
              featuredPodcasts?.map((podcast: any) => (
                <PodcastCard key={podcast.id} podcast={podcast} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Audio Player Demo */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Premium Listening Experience</h2>
            <p className="text-lg text-gray-600">Crystal clear audio with our advanced streaming technology</p>
          </div>
          
          <AudioPlayer episode={demoEpisode} />
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-lg text-gray-600">Discover podcasts in your favorite topics</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Card key={category.name} className="text-center hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <span className="text-xl">{category.icon}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{category.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{category.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Share Your Voice?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who trust TikTalk to share their stories, build their audience, and make an impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-accent text-gray-900 hover:bg-yellow-400"
              onClick={() => window.location.href = "/api/login"}
            >
              Start Your Podcast Today
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-primary"
            >
              Explore Features
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Play className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">TikTalk</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                The premier platform for podcasters and podcast enthusiasts. Create, discover, and enjoy amazing audio content.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Discover</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Categories</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Trending</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">New Releases</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Creators</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Create Podcast</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Analytics</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Resources</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 TikTalk. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
