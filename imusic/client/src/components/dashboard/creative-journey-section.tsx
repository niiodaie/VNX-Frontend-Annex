import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { JourneyStep } from '@shared/schema';

export default function CreativeJourneySection() {
  const { data: journeySteps = [], isLoading } = useQuery<JourneyStep[]>({
    queryKey: ['/api/journey'],
  });
  
  const sortedSteps = [...journeySteps].sort((a, b) => a.order - b.order);

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-white">Your Creative Journey</h2>
        <Link 
          href="/journey"
          className="text-primary hover:text-[#F472B6] text-sm"
        >
          View Full Path
        </Link>
      </div>
      
      <div className="relative">
        <div className="absolute top-0 bottom-0 left-8 w-0.5 bg-[#2D2D2D]"></div>
        
        {isLoading ? (
          <div className="py-8 text-center text-gray-400">Loading your journey...</div>
        ) : (
          sortedSteps.map((step) => (
            <div key={step.id} className="relative flex items-start mb-8">
              <div 
                className={`flex items-center justify-center h-16 w-16 rounded-full 
                  ${step.status === 'completed' 
                    ? 'bg-primary text-white' 
                    : step.status === 'in-progress'
                      ? 'bg-[#1E1E1E] border-2 border-primary text-primary'
                      : 'bg-[#1E1E1E] border border-[#2D2D2D] text-gray-500'
                  } z-10`}
              >
                <i className={`fas ${
                  step.status === 'completed' ? 'fa-check' : step.icon
                } text-xl`}></i>
              </div>
              <div 
                className={`ml-6 bg-[#1E1E1E] rounded-lg p-4 flex-1 ${
                  step.status === 'in-progress' 
                    ? 'border border-primary' 
                    : 'border border-[#2D2D2D]'
                } ${step.status === 'locked' ? 'opacity-70' : ''}`}
              >
                <h3 className="text-lg font-medium text-white">{step.title}</h3>
                <p className="text-gray-400 mb-2">{step.description}</p>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${
                    step.status === 'completed' 
                      ? 'text-green-400' 
                      : step.status === 'in-progress'
                        ? 'text-primary'
                        : 'text-gray-500'
                  }`}>
                    {step.status === 'completed' 
                      ? 'Completed' 
                      : step.status === 'in-progress'
                        ? 'In Progress'
                        : 'Locked'}
                  </span>
                  
                  {step.status === 'in-progress' && (
                    <Link 
                      href="/studio"
                      className="bg-primary hover:bg-primary/90 text-white px-3 py-1 rounded text-sm"
                    >
                      Continue
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
