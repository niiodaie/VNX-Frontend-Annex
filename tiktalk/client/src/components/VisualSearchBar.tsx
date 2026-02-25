import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface VisualSearchBarProps {
  onSearch: (query: string) => void;
}

export default function VisualSearchBar({ onSearch }: VisualSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const visualSearchMutation = useMutation({
    mutationFn: async (imageData: string) => {
      const response = await apiRequest('POST', '/api/search/visual', { imageData });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Visual Search Complete",
        description: `Found ${data.results.length} similar products`,
      });
      // In a real implementation, this would update the product grid with search results
      console.log('Visual search results:', data.results);
    },
    onError: () => {
      toast({
        title: "Visual Search Failed",
        description: "Please try again with a different image",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      visualSearchMutation.mutate(imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-full p-2 shadow-lg">
        <div className="flex items-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={visualSearchMutation.isPending}
            className="p-3 text-gray-400 hover:text-gray-600"
          >
            <Camera className="w-5 h-5" />
          </Button>
          <Input
            type="text"
            placeholder="Search for gear like 'Joe Rogan mic' or upload an image..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border-none focus:ring-0 text-gray-700"
          />
          <Button
            onClick={handleSearch}
            className="bg-primary text-white px-6 py-3 rounded-full hover:bg-indigo-600 transition-colors"
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <p className="text-sm text-indigo-200 mt-3 text-center">
        Upload an image of gear you've seen in podcasts to find it instantly
      </p>
    </div>
  );
}
