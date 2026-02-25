import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Users, Music, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import SiteHeader from '../components/layout/SiteHeader';

interface Collaboration {
  id: number;
  title: string;
  description: string;
  createdBy: number;
  lookingFor: string;
  genre: string;
  tags: string;
  imageUrl?: string | null;
  createdAt: string;
}

const CollaborationsPage = () => {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch collaborations
    const fetchCollaborations = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/collaborations');
        if (response.ok) {
          const data = await response.json();
          setCollaborations(data);
        } else {
          console.error('Failed to fetch collaborations');
          // Set mock data if API fails
          setCollaborations([
            {
              id: 1,
              title: 'Lo-Fi Beat Collection',
              description: 'Looking for vocalists & writers for a collection of chill lo-fi tracks.',
              createdBy: 1,
              lookingFor: 'vocalists, writers',
              genre: 'Lo-Fi',
              tags: 'Lo-Fi,Chill',
              imageUrl: null,
              createdAt: new Date().toISOString()
            },
            {
              id: 2,
              title: 'Trap EP Project',
              description: 'Need producers & engineers for an upcoming trap EP. Must have experience with 808s.',
              createdBy: 2,
              lookingFor: 'producers, engineers',
              genre: 'Trap',
              tags: 'Trap,Hip-Hop',
              imageUrl: null,
              createdAt: new Date().toISOString()
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching collaborations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollaborations();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader />
      <div className="p-4">
        <div className="container mx-auto">
          <div className="flex items-center mb-6">
            <Link href="/" className="text-purple-400 hover:text-purple-300 mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h2 className="text-2xl font-serif text-purple-300">Collabs</h2>
          </div>
          
          <div className="mb-8">
            <Button 
              className="bg-purple-800 hover:bg-purple-700 text-white"
              onClick={() => {
                alert('Creating a new collaboration...');
                // In a real implementation, this would open a form or modal
              }}
            >
              <Users className="w-4 h-4 mr-2" /> Create New Collab
            </Button>
          </div>
          
          {/* Mobile-friendly grid layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="flex justify-center items-center h-40 col-span-full">
                <p className="text-purple-400 animate-pulse">Loading collaborations...</p>
              </div>
            ) : (
              collaborations.map(collab => (
                <Card key={collab.id} className="bg-[#121212] border-purple-900/30 p-4 hover:bg-[#1a1a1a] transition-colors">
                  <div className="flex items-center mb-2">
                    <Music className="w-5 h-5 text-purple-400 mr-2 flex-shrink-0" />
                    <h2 className="text-xl font-bold text-white truncate">{collab.title}</h2>
                  </div>
                  <p className="text-gray-300 mb-4 text-sm sm:text-base line-clamp-3">{collab.description}</p>
                  <div className="mb-3">
                    <span className="text-sm font-semibold text-purple-300">Looking for:</span>
                    <span className="text-gray-300 ml-2 text-sm">{collab.lookingFor}</span>
                  </div>
                  <div className="mb-3">
                    <span className="text-sm font-semibold text-purple-300">Genre:</span>
                    <span className="text-gray-300 ml-2 text-sm">{collab.genre}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {collab.tags.split(',').map((tag, i) => (
                      <span key={i} className="text-xs bg-purple-900/50 px-2 py-1 rounded-full">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                  <Button 
                    className="w-full bg-[#332940] hover:bg-[#3d304c] text-white text-sm sm:text-base"
                    onClick={() => {
                      alert(`Connecting to collaboration: ${collab.title}`);
                      // In a real implementation, this would handle the connection request
                    }}
                  >
                    Connect
                  </Button>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationsPage;