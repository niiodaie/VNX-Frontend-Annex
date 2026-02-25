import { useAuth } from '@/hooks/use-auth';
// @ts-ignore - Ignoring type issues with JSX file
import MentorDashboard from '@/components/MentorDashboard';
import { useCallback } from 'react';
import { useLocation } from 'wouter';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

// Simplified home page using MentorDashboard component
export default function HomePage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  // Fetch the user's mentor data from the API
  const { data: userMentor, isLoading } = useQuery({
    queryKey: ['/api/user/mentor'],
    enabled: !!user,
    retry: 1, // Don't retry too many times to avoid error loops
    // onError is handled via global query client config
  } as UseQueryOptions);
  
  // Handler for changing mentor
  const handleChangeMentor = useCallback(() => {
    setLocation('/mentor');
  }, [setLocation]);

  // Show loading state while fetching mentor data
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Proceed even if there's an error or userMentor is null
  // MentorDashboard has fallback handling for this case
  return (
    <MentorDashboard
      mentor={userMentor || null}
      onChangeMentor={handleChangeMentor}
    />
  );
}