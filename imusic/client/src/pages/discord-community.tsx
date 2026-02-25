import React from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Users, MessageSquareText, Headphones, Globe, Star, Shield, Music, Gift, Bell, Coins } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
// Using simple header instead of importing a non-existent component
// import { Header } from '@/components/ui/header';

const DiscordCommunityPage = () => {
  return (
    <div className="min-h-screen bg-[#07050a] text-gray-100">
      {/* Simple header */}
      <div className="bg-[#0b0812] border-b border-purple-900/20 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/home" className="text-white font-bold text-2xl">
              <span className="text-purple-400">Dark</span>Notes
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/home" className="text-gray-300 hover:text-purple-400">Home</Link>
            <Link href="/mentor-selection" className="text-gray-300 hover:text-purple-400">Mentors</Link>
            <Link href="/muse-lab-simple" className="text-gray-300 hover:text-purple-400">Studio</Link>
            <Link href="/collaborations" className="text-gray-300 hover:text-purple-400">Collaborate</Link>
            <Link href="/affiliates" className="text-gray-300 hover:text-purple-400">Affiliates</Link>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/home" className="text-purple-400 hover:text-purple-300 mr-4">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-serif text-purple-300 tracking-wide">Discord Community</h1>
        </div>
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#1a1020] to-[#120b1b] p-6 rounded-lg mb-8 border border-purple-900/20 shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 space-y-4">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">Join the DarkNotes Discord</h2>
              <p className="text-gray-300">Connect with fellow artists, get feedback on your music, join exclusive challenges, and engage directly with your AI mentors.</p>
              <div className="flex flex-wrap gap-3">
                <a href="https://discord.gg" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-[#5865F2] hover:bg-[#4752C4] text-white">
                    Join Discord Community
                  </Button>
                </a>
                <Button 
                  variant="outline" 
                  className="border-purple-500/40 text-purple-300 hover:bg-purple-900/20 flex items-center gap-2"
                >
                  <Coins className="w-4 h-4" /> Reward Coins for Challenges
                </Button>
              </div>
            </div>
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="relative w-44 h-44 md:w-52 md:h-52">
                <div className="absolute inset-0 bg-[#5865F2] rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Stylized Discord logo */}
                  <svg className="w-28 h-28 md:w-32 md:h-32 text-[#5865F2]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36" fill="currentColor">
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="bg-[#121212] border-purple-900/30 shadow-md overflow-hidden">
            <CardHeader className="pb-2">
              <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center mb-2">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <CardTitle className="text-white">Artist Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Connect with like-minded artists, share your creations, and grow your network.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#121212] border-purple-900/30 shadow-md overflow-hidden">
            <CardHeader className="pb-2">
              <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center mb-2">
                <MessageSquareText className="w-5 h-5 text-purple-400" />
              </div>
              <CardTitle className="text-white">Mentor Discussions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Special channels dedicated to each AI mentor with community discussion.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#121212] border-purple-900/30 shadow-md overflow-hidden">
            <CardHeader className="pb-2">
              <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center mb-2">
                <Headphones className="w-5 h-5 text-purple-400" />
              </div>
              <CardTitle className="text-white">Listening Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Weekly listening parties where community members share and critique works.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#121212] border-purple-900/30 shadow-md overflow-hidden">
            <CardHeader className="pb-2">
              <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center mb-2">
                <Globe className="w-5 h-5 text-purple-400" />
              </div>
              <CardTitle className="text-white">Global Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Virtual concerts, music production workshops, and industry guest appearances.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#121212] border-purple-900/30 shadow-md overflow-hidden">
            <CardHeader className="pb-2">
              <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center mb-2">
                <Star className="w-5 h-5 text-purple-400" />
              </div>
              <CardTitle className="text-white">Exclusive Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Early access to new features, special mentor content, and community highlights.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#121212] border-purple-900/30 shadow-md overflow-hidden">
            <CardHeader className="pb-2">
              <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center mb-2">
                <Bell className="w-5 h-5 text-purple-400" />
              </div>
              <CardTitle className="text-white">Platform Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Stay informed about the latest DarkNotes features, updates, and announcements.</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Server Channels Preview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Explore Our Discord Channels</h2>
          
          <div className="bg-[#121212] border border-purple-900/30 rounded-lg p-6 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl text-purple-300 font-semibold">Community Spaces</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-300">
                    <span className="text-[#5865F2] mr-2">#</span> welcome-and-rules
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="text-[#5865F2] mr-2">#</span> announcements
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="text-[#5865F2] mr-2">#</span> general-chat
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="text-[#5865F2] mr-2">#</span> share-your-music
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="text-[#5865F2] mr-2">#</span> feedback-and-support
                  </li>
                </ul>
                
                <h3 className="text-xl text-purple-300 font-semibold pt-2">Creative Spaces</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-300">
                    <span className="text-[#5865F2] mr-2">#</span> production-tips
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="text-[#5865F2] mr-2">#</span> lyric-workshop
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="text-[#5865F2] mr-2">#</span> beat-showcase
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl text-purple-300 font-semibold">Mentor Channels</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-300">
                    <span className="text-[#5865F2] mr-2">#</span> kendrick-flow-lounge
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="text-[#5865F2] mr-2">#</span> nova-rae-sessions
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="text-[#5865F2] mr-2">#</span> metrodeep-studio
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="text-[#5865F2] mr-2">#</span> blaze420-circle
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="text-[#5865F2] mr-2">#</span> ivymuse-hive
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="text-[#5865F2] mr-2">#</span> yemi-sound-waves
                  </li>
                </ul>
                
                <h3 className="text-xl text-purple-300 font-semibold pt-2">Collaboration Zones</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-300">
                    <span className="text-[#5865F2] mr-2">#</span> find-a-producer
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="text-[#5865F2] mr-2">#</span> collab-requests
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="text-[#5865F2] mr-2">#</span> project-teams
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Community Guidelines */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Community Guidelines</h2>
          
          <Card className="bg-[#121212] border-purple-900/30 shadow-md overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Respect Each Other</h3>
                    <p className="text-gray-400 text-sm">Treat all members with kindness and respect. Harassment, hate speech, and discrimination will not be tolerated.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <Music className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Constructive Feedback</h3>
                    <p className="text-gray-400 text-sm">When providing feedback on others' music, be constructive and supportive. Remember everyone is on their own creative journey.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <MessageSquareText className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Keep It Clean</h3>
                    <p className="text-gray-400 text-sm">No explicit content outside of designated channels. Keep all conversations and shared content appropriate and professional.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <Gift className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Share Your Gift</h3>
                    <p className="text-gray-400 text-sm">Be generous with your knowledge and experience. The community thrives when we help each other grow.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Call-to-Action */}
        <div className="text-center mb-12 py-8">
          <h2 className="text-3xl font-bold text-purple-300 mb-4">Ready to Join Our Community?</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-6">
            Connect with thousands of artists, get real-time feedback, and accelerate your growth through community collaboration.
          </p>
          <a href="https://discord.gg" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-[#5865F2] hover:bg-[#4752C4] text-white">
              Join the DarkNotes Discord
            </Button>
          </a>
        </div>
        
        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <Card className="bg-[#121212] border-purple-900/30 shadow-md overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">How do I join the Discord server?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Click the "Join Discord Community" button on this page, which will redirect you to Discord where you can accept the server invitation.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-[#121212] border-purple-900/30 shadow-md overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">Do I need a DarkNotes account to join?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">While anyone can join our Discord community, linking your DarkNotes account gives you access to premium channels and mentor-specific content.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-[#121212] border-purple-900/30 shadow-md overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">How do the weekly listening sessions work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Every Friday at 8 PM EST, we host a voice channel session where community members can share their music and receive feedback. Sign-ups open 24 hours before each session.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-[#121212] border-purple-900/30 shadow-md overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">Are there community moderators?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Yes, our Discord is moderated by a team of dedicated community members and DarkNotes staff to ensure a positive and helpful environment for everyone.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-[#070709] border-t border-purple-900/20 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-500 text-sm">© 2025 DarkNotes. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/terms" className="text-gray-400 hover:text-purple-300 text-sm">Terms</Link>
              <Link href="/privacy" className="text-gray-400 hover:text-purple-300 text-sm">Privacy</Link>
              <Link href="/contact" className="text-gray-400 hover:text-purple-300 text-sm">Contact</Link>
              <Link href="/affiliates" className="text-gray-400 hover:text-purple-300 text-sm">Affiliates</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DiscordCommunityPage;