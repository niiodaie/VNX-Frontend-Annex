import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { User } from "@/App";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface InstructorCustomizationProps {
  user: User;
}

const InstructorCustomization = ({ user }: InstructorCustomizationProps) => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [selectedAppearance, setSelectedAppearance] = useState<string>("");
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [selectedTeachingStyle, setSelectedTeachingStyle] = useState<string>("");
  const [customName, setCustomName] = useState<string>("My Custom Instructor");
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
  
  // Fetch available appearances, voices, and subjects
  const { data: appearances, isLoading: isLoadingAppearances } = useQuery({
    queryKey: ['/api/instructor/appearances'],
    queryFn: () => {
      // Mock data for development
      return [
        {
          id: 'professional-female-1',
          name: 'Professional Female 1',
          previewUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e',
          gender: 'female',
        },
        {
          id: 'professional-male-1',
          name: 'Professional Male 1',
          previewUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5',
          gender: 'male',
        },
        {
          id: 'professional-female-2',
          name: 'Professional Female 2',
          previewUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
          gender: 'female',
        },
        {
          id: 'professional-male-2',
          name: 'Professional Male 2',
          previewUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
          gender: 'male',
        },
      ];
    }
  });
  
  const { data: voices, isLoading: isLoadingVoices } = useQuery({
    queryKey: ['/api/instructor/voices'],
    queryFn: () => {
      // Mock data for development
      return [
        {
          id: 'en-US-Neural2-F',
          name: 'English - Female (US)',
          language: 'en',
          gender: 'female',
        },
        {
          id: 'en-US-Neural2-D',
          name: 'English - Male (US)',
          language: 'en',
          gender: 'male',
        },
        {
          id: 'en-GB-Neural2-B',
          name: 'English - Female (UK)',
          language: 'en',
          gender: 'female',
        },
        {
          id: 'es-ES-Neural2-A',
          name: 'Spanish - Female',
          language: 'es',
          gender: 'female',
        },
        {
          id: 'es-ES-Neural2-C',
          name: 'Spanish - Male',
          language: 'es',
          gender: 'male',
        },
      ];
    }
  });
  
  const { data: teachingStyles, isLoading: isLoadingTeachingStyles } = useQuery({
    queryKey: ['/api/instructor/teaching-styles'],
    queryFn: () => {
      // Mock data for development
      return [
        {
          id: 'detailed',
          name: 'Detailed and Thorough',
          description: 'Provides in-depth explanations with many examples',
        },
        {
          id: 'concise',
          name: 'Concise and Clear',
          description: 'Gets straight to the point with clear explanations',
        },
        {
          id: 'interactive',
          name: 'Interactive and Engaging',
          description: 'Asks questions and engages students throughout the lesson',
        },
        {
          id: 'visual',
          name: 'Visual and Demonstrative',
          description: 'Uses many visual aids and demonstrations',
        },
      ];
    }
  });
  
  const { data: subjects, isLoading: isLoadingSubjects } = useQuery({
    queryKey: ['/api/subjects'],
  });
  
  // Create custom instructor mutation
  const createInstructorMutation = useMutation({
    mutationFn: async (instructorData: any) => {
      return apiRequest("POST", `/api/user/${user.id}/instructors`, instructorData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/user/${user.id}/instructors`] });
      toast({
        title: "Instructor Created",
        description: "Your custom instructor has been created successfully!",
      });
      setLocation("/");
    },
    onError: (error) => {
      console.error("Error creating instructor:", error);
      toast({
        title: "Error",
        description: "Failed to create custom instructor",
        variant: "destructive"
      });
    }
  });
  
  const handleCreateInstructor = () => {
    if (!selectedAppearance || !selectedVoice || !selectedTeachingStyle || selectedSubjects.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select all required options",
        variant: "destructive"
      });
      return;
    }
    
    createInstructorMutation.mutate({
      instructorId: 0, // New instructor
      isCustomized: true,
      customSettings: {
        name: customName,
        appearance: selectedAppearance,
        voice: selectedVoice,
        teachingStyle: selectedTeachingStyle,
        subjectSpecialties: selectedSubjects,
        language: user.language
      }
    });
  };
  
  const toggleSubject = (subjectId: number) => {
    if (selectedSubjects.includes(subjectId)) {
      setSelectedSubjects(selectedSubjects.filter(id => id !== subjectId));
    } else {
      setSelectedSubjects([...selectedSubjects, subjectId]);
    }
  };
  
  if (isLoadingAppearances || isLoadingVoices || isLoadingTeachingStyles || isLoadingSubjects) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-semibold text-neutral-900 font-heading mb-6">
            Customize Your AI Instructor
          </h1>
          
          <div className="mb-6">
            <Label htmlFor="instructor-name" className="block text-sm font-medium text-gray-700 mb-1">
              Instructor Name
            </Label>
            <input
              type="text"
              id="instructor-name"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Enter instructor name"
            />
          </div>
          
          <Tabs defaultValue="appearance" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="voice">Voice</TabsTrigger>
              <TabsTrigger value="style">Teaching Style</TabsTrigger>
            </TabsList>
            
            {/* Appearance Tab */}
            <TabsContent value="appearance" className="pt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {appearances?.map((appearance) => (
                  <div 
                    key={appearance.id}
                    className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                      selectedAppearance === appearance.id ? 'ring-2 ring-primary-500' : 'hover:opacity-90'
                    }`}
                    onClick={() => setSelectedAppearance(appearance.id)}
                  >
                    <img 
                      src={appearance.previewUrl} 
                      alt={appearance.name} 
                      className="w-full h-48 object-cover"
                    />
                    {selectedAppearance === appearance.id && (
                      <div className="absolute top-2 right-2 bg-primary-500 rounded-full p-1">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div className="p-2 bg-white">
                      <p className="text-sm font-medium text-neutral-900 truncate">{appearance.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            {/* Voice Tab */}
            <TabsContent value="voice" className="pt-4">
              <RadioGroup value={selectedVoice} onValueChange={setSelectedVoice}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {voices?.map((voice) => (
                    <div 
                      key={voice.id} 
                      className={`border rounded-md p-4 ${
                        selectedVoice === voice.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                      }`}
                    >
                      <RadioGroupItem 
                        value={voice.id} 
                        id={`voice-${voice.id}`} 
                        className="sr-only" 
                      />
                      <Label
                        htmlFor={`voice-${voice.id}`}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{voice.name}</p>
                          <p className="text-xs text-neutral-500">
                            {voice.gender === 'female' ? 'Female Voice' : 'Male Voice'}
                          </p>
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          className="text-primary-600"
                          onClick={(e) => {
                            e.preventDefault();
                            // In a real app, this would play a sample of the voice
                            toast({
                              title: "Voice Sample",
                              description: `Playing sample of ${voice.name}`,
                            });
                          }}
                        >
                          Preview
                        </Button>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </TabsContent>
            
            {/* Teaching Style Tab */}
            <TabsContent value="style" className="pt-4">
              <RadioGroup value={selectedTeachingStyle} onValueChange={setSelectedTeachingStyle}>
                <div className="space-y-4">
                  {teachingStyles?.map((style) => (
                    <div 
                      key={style.id} 
                      className={`border rounded-md p-4 ${
                        selectedTeachingStyle === style.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                      }`}
                    >
                      <RadioGroupItem 
                        value={style.id} 
                        id={`style-${style.id}`} 
                        className="sr-only" 
                      />
                      <Label
                        htmlFor={`style-${style.id}`}
                        className="flex items-start cursor-pointer"
                      >
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{style.name}</p>
                          <p className="text-xs text-neutral-500 mt-1">{style.description}</p>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </TabsContent>
          </Tabs>
          
          {/* Subject Specialties */}
          <div className="mt-8">
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Subject Specialties (select at least one)
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {subjects?.map((subject) => (
                <div
                  key={subject.id}
                  onClick={() => toggleSubject(subject.id)}
                  className={`p-3 rounded-md cursor-pointer text-center transition-colors ${
                    selectedSubjects.includes(subject.id)
                      ? 'bg-primary-100 border-primary-300 border text-primary-700'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                  }`}
                >
                  <span className="text-sm font-medium">{subject.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Create Button */}
          <div className="mt-8 flex justify-end">
            <Button
              type="button"
              variant="outline"
              className="mr-3"
              onClick={() => setLocation("/")}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateInstructor}
              disabled={createInstructorMutation.isPending}
            >
              {createInstructorMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Instructor"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorCustomization;
