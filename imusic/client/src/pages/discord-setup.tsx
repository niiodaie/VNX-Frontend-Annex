import React from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Copy, FileCode, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SiteHeader from '@/components/layout/SiteHeader';
import ChannelStructure from '@/components/discord/ChannelStructure';
import RoleStructure from '@/components/discord/RoleStructure';
import BotRecommendations from '@/components/discord/BotRecommendations';

const DiscordSetup = () => {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-black">
      <SiteHeader />
      
      <main className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setLocation('/')}
              className="mr-2 text-gray-400 hover:text-white"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-2xl font-bold text-white">Discord Server Setup</h1>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex items-center">
              <Copy size={16} className="mr-2" />
              <span>Copy Config</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center">
              <Download size={16} className="mr-2" />
              <span>Download Guide</span>
            </Button>
          </div>
        </div>
        
        <div className="bg-[#121212] border border-purple-900/20 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="bg-purple-900/20 p-2 rounded-md mr-4">
              <FileCode size={24} className="text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">Discord Server Setup Guide</h2>
              <p className="text-gray-300 text-sm mb-3">
                Build a thriving Discord community for your music production journey with this comprehensive setup guide.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-purple-900/20 text-purple-300 text-xs px-2 py-1 rounded">Community Building</span>
                <span className="bg-purple-900/20 text-purple-300 text-xs px-2 py-1 rounded">Channel Structure</span>
                <span className="bg-purple-900/20 text-purple-300 text-xs px-2 py-1 rounded">Role Management</span>
                <span className="bg-purple-900/20 text-purple-300 text-xs px-2 py-1 rounded">Bot Integration</span>
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="channels" className="space-y-6">
          <TabsList className="bg-[#1E1E1E] border-b border-[#2D2D2D] p-0 mb-4 w-full">
            <TabsTrigger 
              value="channels" 
              className="data-[state=active]:bg-[#1E1E1E] data-[state=active]:border-t-2 data-[state=active]:border-t-purple-500 data-[state=active]:shadow-none rounded-none py-3 px-4 text-sm"
            >
              Channel Structure
            </TabsTrigger>
            <TabsTrigger 
              value="roles" 
              className="data-[state=active]:bg-[#1E1E1E] data-[state=active]:border-t-2 data-[state=active]:border-t-purple-500 data-[state=active]:shadow-none rounded-none py-3 px-4 text-sm"
            >
              Role Management
            </TabsTrigger>
            <TabsTrigger 
              value="bots" 
              className="data-[state=active]:bg-[#1E1E1E] data-[state=active]:border-t-2 data-[state=active]:border-t-purple-500 data-[state=active]:shadow-none rounded-none py-3 px-4 text-sm"
            >
              Bot Recommendations
            </TabsTrigger>
            <TabsTrigger 
              value="getting-started" 
              className="data-[state=active]:bg-[#1E1E1E] data-[state=active]:border-t-2 data-[state=active]:border-t-purple-500 data-[state=active]:shadow-none rounded-none py-3 px-4 text-sm"
            >
              Getting Started
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="channels" className="mt-6">
            <ChannelStructure />
          </TabsContent>
          
          <TabsContent value="roles" className="mt-6">
            <RoleStructure />
          </TabsContent>
          
          <TabsContent value="bots" className="mt-6">
            <BotRecommendations />
          </TabsContent>
          
          <TabsContent value="getting-started" className="mt-6">
            <div className="bg-[#1E1E1E] border-purple-900/30 rounded-md p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Getting Started</h3>
              
              <div className="space-y-4">
                <div className="border-l-2 border-purple-500 pl-4">
                  <h4 className="text-white font-medium mb-2">Step 1: Create Your Server</h4>
                  <p className="text-gray-300 text-sm">
                    Click the + icon in the Discord app and select "Create My Own" then "For a club or community".
                    Name your server "DarkNotes Community" or something similar.
                  </p>
                </div>
                
                <div className="border-l-2 border-green-500 pl-4">
                  <h4 className="text-white font-medium mb-2">Step 2: Set Up Channels</h4>
                  <p className="text-gray-300 text-sm">
                    Create categories and channels according to the structure in the Channels tab.
                    Right-click on your server name to add a new category, then right-click on the category to add channels.
                  </p>
                </div>
                
                <div className="border-l-2 border-blue-500 pl-4">
                  <h4 className="text-white font-medium mb-2">Step 3: Configure Roles</h4>
                  <p className="text-gray-300 text-sm">
                    Go to Server Settings {'>'}  Roles and create roles according to the Roles tab.
                    Set appropriate permissions for each role and configure hierarchy (Admin at top, Artist at bottom).
                  </p>
                </div>
                
                <div className="border-l-2 border-yellow-500 pl-4">
                  <h4 className="text-white font-medium mb-2">Step 4: Add Bots</h4>
                  <p className="text-gray-300 text-sm">
                    Visit the websites of recommended bots and follow their instructions to add them to your server.
                    Configure the bots according to your needs.
                  </p>
                </div>
                
                <div className="border-l-2 border-red-500 pl-4">
                  <h4 className="text-white font-medium mb-2">Step 5: Customize and Launch</h4>
                  <p className="text-gray-300 text-sm">
                    Add server icon and banner, customize welcome messages, and write rules.
                    Invite your first members and start building your music community!
                  </p>
                </div>
              </div>
              
              <div className="mt-6 bg-[#0D0D0D] p-4 rounded-md border border-[#2D2D2D]">
                <h4 className="text-white font-medium mb-2">Need Help?</h4>
                <p className="text-gray-300 text-sm">
                  If you need assistance setting up your Discord server, our team is here to help.
                  Contact us through the app or email support@darknotes.com for personalized guidance.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DiscordSetup;