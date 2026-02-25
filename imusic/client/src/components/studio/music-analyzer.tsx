import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, ThumbsUp, ThumbsDown, Star } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface MusicAnalysis {
  strengths: string[];
  improvements: string[];
  overallRating: number;
  analysis: string;
}

export default function MusicAnalyzer() {
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState<'lyrics' | 'composition' | 'recording'>('lyrics');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<MusicAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter some content to analyze.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const response = await apiRequest('POST', '/api/music/analyze', {
        content,
        contentType
      });
      
      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze your music. Please try again.",
        variant: "destructive"
      });
      console.error('Failed to analyze music:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Music Analyzer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">What would you like to analyze?</label>
            <Select 
              value={contentType} 
              onValueChange={(value: 'lyrics' | 'composition' | 'recording') => setContentType(value)}
            >
              <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="lyrics">Lyrics</SelectItem>
                <SelectItem value="composition">Composition/Notation</SelectItem>
                <SelectItem value="recording">Recording Description</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm text-gray-400 mb-2 block">
              {contentType === 'lyrics' 
                ? 'Paste your lyrics here' 
                : contentType === 'composition' 
                  ? 'Describe your composition or paste notation' 
                  : 'Describe your recording'}
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={contentType === 'lyrics' 
                ? 'Paste your lyrics here...' 
                : contentType === 'composition' 
                  ? 'Describe your composition or paste notation...' 
                  : 'Describe your recording in detail...'}
              className="min-h-[200px] bg-gray-800/50 border-gray-700 text-white"
            />
          </div>
          
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing || !content.trim()}
            className="w-full bg-purple-700 hover:bg-purple-600"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : 'Analyze'}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center">
              Analysis Results
              <div className="ml-auto flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    className={`h-5 w-5 ${i < Math.round(analysis.overallRating / 2) 
                      ? 'text-yellow-500 fill-yellow-500' 
                      : 'text-gray-600'}`}
                  />
                ))}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Overview</h3>
              <p className="text-gray-200">{analysis.analysis}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                  <ThumbsUp className="mr-2 h-5 w-5 text-green-500" />
                  Strengths
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-200">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                  <ThumbsDown className="mr-2 h-5 w-5 text-orange-500" />
                  Areas for Improvement
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-200">
                  {analysis.improvements.map((improvement, index) => (
                    <li key={index}>{improvement}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}