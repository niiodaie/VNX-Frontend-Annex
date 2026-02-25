import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Music, MessageSquare, Layers } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface MusicIdea {
  concept: string;
  lyricalHooks: string[];
  melodyDescription: string;
  structureIdea: string;
}

export default function CreativeIdeaGenerator() {
  const { toast } = useToast();
  const [genre, setGenre] = useState('');
  const [theme, setTheme] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [idea, setIdea] = useState<MusicIdea | null>(null);

  const handleGenerate = async () => {
    if (!genre.trim() || !theme.trim()) {
      toast({
        title: "Information Required",
        description: "Please enter both genre and theme.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await apiRequest('POST', '/api/music/generate-idea', {
        genre,
        theme,
        additionalContext: additionalContext.trim() || undefined
      });
      
      const data = await response.json();
      setIdea(data);
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate a music idea. Please try again.",
        variant: "destructive"
      });
      console.error('Failed to generate music idea:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Creative Idea Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Music Genre</label>
              <Input
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="e.g., Hip-Hop, Jazz, Folk, EDM..."
                className="bg-gray-800/50 border-gray-700 text-white"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Theme or Topic</label>
              <Input
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="e.g., Lost love, Urban life, Nature..."
                className="bg-gray-800/50 border-gray-700 text-white"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Additional Context (Optional)</label>
            <Textarea
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="Any additional details you'd like to include..."
              className="bg-gray-800/50 border-gray-700 text-white"
            />
          </div>
          
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !genre.trim() || !theme.trim()}
            className="w-full bg-purple-700 hover:bg-purple-600"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Idea
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {idea && (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-white">Your Music Idea</CardTitle>
              <Badge variant="outline" className="bg-purple-900/30 hover:bg-purple-900/50 text-purple-300 border-purple-700">
                {genre.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-2 flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-yellow-500" />
                Concept
              </h3>
              <p className="text-gray-200">{idea.concept}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-2 flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
                Lyrical Hooks
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-200">
                {idea.lyricalHooks.map((hook, index) => (
                  <li key={index} className="italic">"{hook}"</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-2 flex items-center">
                <Music className="mr-2 h-5 w-5 text-green-500" />
                Melody Ideas
              </h3>
              <p className="text-gray-200">{idea.melodyDescription}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-2 flex items-center">
                <Layers className="mr-2 h-5 w-5 text-orange-500" />
                Structure Suggestion
              </h3>
              <p className="text-gray-200">{idea.structureIdea}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}