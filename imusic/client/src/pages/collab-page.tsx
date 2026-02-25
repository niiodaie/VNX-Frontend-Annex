import { useQuery } from '@tanstack/react-query';
import { Collaboration } from '@shared/schema';
import Sidebar from '@/components/layout/sidebar';
import MobileNav from '@/components/layout/mobile-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function CollabPage() {
  const { data: collaborations = [], isLoading } = useQuery<Collaboration[]>({
    queryKey: ['/api/collaborations'],
  });

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-[#121212] text-white">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto bg-[#121212] pb-16 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Collab Zone</h1>
            <p className="text-gray-400 mt-2">Find artists to collaborate with and create together</p>
          </div>
          
          <div className="bg-[#1E1E1E] rounded-xl shadow-lg border border-[#2D2D2D] p-6 mb-8">
            <h2 className="text-xl font-medium text-white mb-4">Start a New Collaboration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-300 mb-4">Looking for other artists to collaborate with? Create a new collab project and find the perfect match.</p>
                
                <Button className="bg-primary hover:bg-primary/90 w-full md:w-auto">
                  <i className="fas fa-plus mr-2"></i>
                  Create New Collab
                </Button>
              </div>
              
              <div className="bg-[#2D2D2D] rounded-lg p-4 notebook-bg">
                <h3 className="text-lg font-medium text-white mb-2">Mentor Advice</h3>
                <p className="text-gray-300 italic text-sm">
                  "Collaboration is where magic happens. Look for artists who complement your style, not just mirror it. The best collabs create something neither of you could make alone."
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full">
              <Input 
                className="bg-[#1E1E1E] border-[#2D2D2D] pl-10 py-6"
                placeholder="Search for collaborations..."
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" className="flex-1 sm:flex-none bg-[#1E1E1E] border-[#2D2D2D] hover:bg-[#2D2D2D]">
                <i className="fas fa-filter mr-2"></i>
                Filter
              </Button>
              <Button variant="outline" className="flex-1 sm:flex-none bg-[#1E1E1E] border-[#2D2D2D] hover:bg-[#2D2D2D]">
                <i className="fas fa-sort mr-2"></i>
                Sort
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-4 mb-8">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="beats">Beats</TabsTrigger>
              <TabsTrigger value="vocals">Vocals</TabsTrigger>
              <TabsTrigger value="production">Production</TabsTrigger>
            </TabsList>
            
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            )}
            
            <TabsContent value="all" className="space-y-6">
              {!isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {collaborations.map((collab) => (
                    <Card key={collab.id} className="bg-[#1E1E1E] border-[#2D2D2D] overflow-hidden hover:border-primary/50 transition-all duration-300">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-medium text-white">{collab.title}</h3>
                          <span className="inline-block px-2 py-1 bg-[#2D2D2D] rounded-full text-xs text-gray-300">
                            {collab.genre}
                          </span>
                        </div>
                        
                        <p className="text-gray-400 mb-4">{collab.description}</p>
                        
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-300 mb-2">Looking for</h4>
                          <div className="flex flex-wrap gap-2">
                            {collab.lookingFor.split(', ').map((role, index) => (
                              <span key={index} className="inline-block px-2 py-1 bg-[#121212] text-xs text-gray-300 rounded">
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-300 mb-2">Tags</h4>
                          <div className="flex flex-wrap gap-2">
                            {collab.tags.split(',').map((tag, index) => (
                              <span key={index} className="inline-block px-2 py-1 bg-[#121212] text-xs text-gray-300 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-[#2D2D2D] flex items-center justify-center">
                              <i className="fas fa-user text-gray-400"></i>
                            </div>
                            <span className="ml-2 text-sm text-gray-400">Creator #{collab.createdBy}</span>
                          </div>
                          
                          <Button className="bg-primary hover:bg-primary/90">
                            Join
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                  
                  {/* Add some empty collabs for the UI */}
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={`empty-${i}`} className="bg-[#1E1E1E] border-[#2D2D2D] overflow-hidden hover:border-primary/50 transition-all duration-300">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-medium text-white">
                            {i % 2 === 0 ? "Hip-Hop Collaboration" : "R&B Vocal Project"}
                          </h3>
                          <span className="inline-block px-2 py-1 bg-[#2D2D2D] rounded-full text-xs text-gray-300">
                            {i % 2 === 0 ? "Hip-Hop" : "R&B"}
                          </span>
                        </div>
                        
                        <p className="text-gray-400 mb-4">
                          {i % 2 === 0 
                            ? "Looking for rappers and beatmakers for a new EP project" 
                            : "Seeking vocalists and producers for R&B tracks"}
                        </p>
                        
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-300 mb-2">Looking for</h4>
                          <div className="flex flex-wrap gap-2">
                            {(i % 2 === 0 
                              ? ["Rappers", "Producers", "Engineers"] 
                              : ["Vocalists", "Producers", "Writers"]).map((role, index) => (
                              <span key={index} className="inline-block px-2 py-1 bg-[#121212] text-xs text-gray-300 rounded">
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-300 mb-2">Tags</h4>
                          <div className="flex flex-wrap gap-2">
                            {(i % 2 === 0 
                              ? ["Hip-Hop", "Rap", "Beats"] 
                              : ["R&B", "Vocals", "Smooth"]).map((tag, index) => (
                              <span key={index} className="inline-block px-2 py-1 bg-[#121212] text-xs text-gray-300 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-[#2D2D2D] flex items-center justify-center">
                              <i className="fas fa-user text-gray-400"></i>
                            </div>
                            <span className="ml-2 text-sm text-gray-400">Creator #{i + 10}</span>
                          </div>
                          
                          <Button className="bg-primary hover:bg-primary/90">
                            Join
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="beats" className="space-y-6">
              <div className="text-center py-8">
                <i className="fas fa-music text-4xl text-gray-500 mb-4"></i>
                <h3 className="text-xl font-medium text-white mb-2">Beat Collaborations</h3>
                <p className="text-gray-400 mb-4">Find producers to collaborate on beats</p>
                <Button className="bg-primary hover:bg-primary/90">Browse Beat Collabs</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="vocals" className="space-y-6">
              <div className="text-center py-8">
                <i className="fas fa-microphone text-4xl text-gray-500 mb-4"></i>
                <h3 className="text-xl font-medium text-white mb-2">Vocal Collaborations</h3>
                <p className="text-gray-400 mb-4">Connect with vocalists and songwriters</p>
                <Button className="bg-primary hover:bg-primary/90">Browse Vocal Collabs</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="production" className="space-y-6">
              <div className="text-center py-8">
                <i className="fas fa-sliders-h text-4xl text-gray-500 mb-4"></i>
                <h3 className="text-xl font-medium text-white mb-2">Production Collaborations</h3>
                <p className="text-gray-400 mb-4">Work with mixing and mastering engineers</p>
                <Button className="bg-primary hover:bg-primary/90">Browse Production Collabs</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}
