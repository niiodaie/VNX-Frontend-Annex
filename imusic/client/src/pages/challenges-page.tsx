import { useQuery } from '@tanstack/react-query';
import { Challenge } from '@shared/schema';
import Sidebar from '@/components/layout/sidebar';
import MobileNav from '@/components/layout/mobile-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Waveform from '@/components/ui/waveform';
import { Loader2 } from 'lucide-react';

export default function ChallengesPage() {
  const { data: challenges = [], isLoading } = useQuery<Challenge[]>({
    queryKey: ['/api/challenges'],
  });

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-[#121212] text-white">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto bg-[#121212] pb-16 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Challenge Arena</h1>
            <p className="text-gray-400 mt-2">Compete in challenges, showcase your skills, and win prizes</p>
          </div>
          
          <div className="mb-8">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
              </TabsList>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <TabsContent value="active" className="space-y-6">
                    {challenges.filter(c => c.isFeatured).map((challenge) => (
                      <div key={challenge.id} className="bg-gradient-to-r from-primary/20 to-[#F472B6]/20 rounded-xl overflow-hidden shadow-lg border border-primary/30 p-6 relative">
                        <div className="absolute top-0 right-0 bg-[#F472B6] text-white px-3 py-1 rounded-bl-lg text-sm font-medium">
                          Featured
                        </div>
                        
                        <h3 className="text-xl font-medium text-white mb-2">{challenge.title}</h3>
                        <p className="text-gray-300 mb-4">{challenge.description}</p>
                        
                        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
                          <div>
                            <span className="text-gray-400 text-sm">Entries</span>
                            <p className="text-white text-xl font-medium">{challenge.entries}</p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">Time Left</span>
                            <p className="text-white text-xl font-medium">{challenge.daysLeft} {challenge.daysLeft === 1 ? 'Day' : 'Days'}</p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">Prize</span>
                            <p className="text-white text-xl font-medium">{challenge.prize}</p>
                          </div>
                        </div>
                        
                        <div className="bg-[#1E1E1E] rounded-lg p-4 mb-6">
                          <div className="flex items-center gap-4">
                            <Waveform isAnimated={false} />
                            <Button className="bg-primary hover:bg-primary/90 flex-shrink-0">
                              <i className="fas fa-play mr-2"></i>
                              Listen to Beat
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                          <Button className="bg-primary hover:bg-primary/90 text-white flex-1 inline-flex items-center justify-center">
                            <i className="fas fa-trophy mr-2"></i>
                            Enter Challenge
                          </Button>
                          <Button variant="outline" className="bg-[#1E1E1E] hover:bg-[#2D2D2D] text-white border-[#2D2D2D] flex-1 inline-flex items-center justify-center">
                            <i className="fas fa-info-circle mr-2"></i>
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Additional challenges for UI presentation */}
                      <Card className="bg-[#1E1E1E] border-[#2D2D2D]">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-medium text-white mb-2">16-Bar Verse Challenge</h3>
                          <p className="text-gray-400 mb-4">Write and record a 16-bar verse over the provided beat. Focus on wordplay and storytelling.</p>
                          
                          <div className="flex justify-between mb-4">
                            <div>
                              <span className="text-gray-400 text-sm">Entries</span>
                              <p className="text-white font-medium">124</p>
                            </div>
                            <div>
                              <span className="text-gray-400 text-sm">Time Left</span>
                              <p className="text-white font-medium">4 Days</p>
                            </div>
                          </div>
                          
                          <Button className="bg-primary hover:bg-primary/90 w-full">
                            View Challenge
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-[#1E1E1E] border-[#2D2D2D]">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-medium text-white mb-2">Melody Crafting Challenge</h3>
                          <p className="text-gray-400 mb-4">Create a memorable hook melody using the provided chord progression. Focus on catchiness.</p>
                          
                          <div className="flex justify-between mb-4">
                            <div>
                              <span className="text-gray-400 text-sm">Entries</span>
                              <p className="text-white font-medium">89</p>
                            </div>
                            <div>
                              <span className="text-gray-400 text-sm">Time Left</span>
                              <p className="text-white font-medium">6 Days</p>
                            </div>
                          </div>
                          
                          <Button className="bg-primary hover:bg-primary/90 w-full">
                            View Challenge
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="upcoming" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="bg-[#1E1E1E] border-[#2D2D2D]">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-medium text-white mb-2">Production Remix Challenge</h3>
                          <p className="text-gray-400 mb-4">Remix the provided stems to create a new production. Starts in 3 days.</p>
                          
                          <div className="p-4 rounded-lg bg-[#2D2D2D] mb-4">
                            <span className="text-primary font-medium">Coming Soon</span>
                          </div>
                          
                          <Button variant="outline" className="bg-[#2D2D2D] border-[#2D2D2D] text-white w-full">
                            Set Reminder
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-[#1E1E1E] border-[#2D2D2D]">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-medium text-white mb-2">Beat Battle Tournament</h3>
                          <p className="text-gray-400 mb-4">Producers go head-to-head in a bracket-style tournament. Starts in 7 days.</p>
                          
                          <div className="p-4 rounded-lg bg-[#2D2D2D] mb-4">
                            <span className="text-primary font-medium">Coming Soon</span>
                          </div>
                          
                          <Button variant="outline" className="bg-[#2D2D2D] border-[#2D2D2D] text-white w-full">
                            Set Reminder
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="past" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="bg-[#1E1E1E] border-[#2D2D2D] opacity-80">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-medium text-white mb-2">R&B Songwriting Challenge</h3>
                          <p className="text-gray-400 mb-4">Write an R&B song about personal growth and transformation.</p>
                          
                          <div className="flex justify-between mb-4">
                            <div>
                              <span className="text-gray-400 text-sm">Winner</span>
                              <p className="text-white font-medium">@soulwriter</p>
                            </div>
                            <div>
                              <span className="text-gray-400 text-sm">Entries</span>
                              <p className="text-white font-medium">178</p>
                            </div>
                          </div>
                          
                          <Button variant="outline" className="bg-[#2D2D2D] border-[#2D2D2D] text-white w-full">
                            View Results
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-[#1E1E1E] border-[#2D2D2D] opacity-80">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-medium text-white mb-2">Lo-Fi Beat Challenge</h3>
                          <p className="text-gray-400 mb-4">Create a lo-fi beat using only three samples from the provided pack.</p>
                          
                          <div className="flex justify-between mb-4">
                            <div>
                              <span className="text-gray-400 text-sm">Winner</span>
                              <p className="text-white font-medium">@beatcrafterX</p>
                            </div>
                            <div>
                              <span className="text-gray-400 text-sm">Entries</span>
                              <p className="text-white font-medium">142</p>
                            </div>
                          </div>
                          
                          <Button variant="outline" className="bg-[#2D2D2D] border-[#2D2D2D] text-white w-full">
                            View Results
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
          
          <div className="mb-8">
            <div className="bg-[#1E1E1E] rounded-xl border border-[#2D2D2D] p-6">
              <h2 className="text-xl font-medium text-white mb-4">Leaderboard</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-gray-400 text-sm">
                    <tr>
                      <th className="pb-3 pl-4">Rank</th>
                      <th className="pb-3">Artist</th>
                      <th className="pb-3">Wins</th>
                      <th className="pb-3">Points</th>
                      <th className="pb-3">Latest Badge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map((rank) => (
                      <tr key={rank} className="border-t border-[#2D2D2D]">
                        <td className="py-3 pl-4 font-medium">#{rank}</td>
                        <td className="py-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-[#2D2D2D] flex items-center justify-center mr-2">
                              <i className="fas fa-user text-gray-400"></i>
                            </div>
                            <span>User #{rank}</span>
                          </div>
                        </td>
                        <td className="py-3">{Math.floor(Math.random() * 10) + 1}</td>
                        <td className="py-3">{Math.floor(Math.random() * 1000) + 100}</td>
                        <td className="py-3">
                          <span className="inline-block px-3 py-1 bg-gradient-to-r from-primary/20 to-[#F472B6]/20 rounded-full text-xs">
                            {rank === 1 ? "Challenge Champion" : "Top Contender"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="text-center mt-4">
                <Button variant="link" className="text-primary hover:text-[#F472B6]">
                  View Full Leaderboard
                </Button>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-[#1E1E1E] rounded-xl border border-[#2D2D2D] p-6">
              <h2 className="text-xl font-medium text-white mb-4">Submit a Challenge Idea</h2>
              <p className="text-gray-400 mb-4">Have a great idea for a challenge? Let us know and it might be featured next!</p>
              
              <Button className="bg-primary hover:bg-primary/90">
                <i className="fas fa-lightbulb mr-2"></i>
                Submit Idea
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}
