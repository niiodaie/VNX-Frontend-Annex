import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface CourseCardProps {
  course: {
    id: number;
    name: string;
    description: string;
    imageUrl?: string;
    level?: string;
    progress: number;
  };
}

const CourseCard = ({ course }: CourseCardProps) => {
  const [, setLocation] = useLocation();

  // Generate a color based on the course name for courses without an image
  const getColorFromCourseName = (name: string) => {
    // Simple hash function to generate a hue value between 0 and 360
    const hash = name.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    return `hsl(${hash % 360}, 70%, 45%)`;
  };

  const backgroundColor = getColorFromCourseName(course.name);

  // Get next lesson text based on course name
  const getNextLessonText = () => {
    if (course.name.includes("Mathematics")) {
      return "Calculus: Derivatives in Real-World Applications";
    } else if (course.name.includes("English")) {
      return "Critical Analysis: Hamlet's Soliloquy";
    } else if (course.name.includes("SAT")) {
      return "Full SAT Practice Exam #3 (Combined Sections)";
    } else {
      return "Next lesson in course";
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg course-card transition-all duration-300 hover:shadow-md hover:translate-y-[-4px]">
      <div className="relative h-32" style={{ background: backgroundColor }}>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-opacity-90 to-opacity-90" style={{ 
          from: `${backgroundColor}aa`, 
          to: `${backgroundColor}dd` 
        }}></div>
        
        {course.imageUrl && (
          <img 
            src={course.imageUrl} 
            alt={course.name} 
            className="w-full h-full object-cover opacity-80"
          />
        )}
        
        <div className="absolute top-4 left-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {course.name.includes("Mathematics") ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            ) : course.name.includes("English") ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            ) : course.name.includes("SAT") ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            )}
          </svg>
        </div>
        
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-lg font-semibold text-white font-heading">{course.name}</h3>
          <p className="text-white text-sm opacity-90">{course.description}</p>
        </div>
      </div>
      
      <div className="px-4 py-4">
        <div className="mb-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-neutral-500">Progress</span>
            <span className="font-medium text-neutral-800">{course.progress}%</span>
          </div>
          <Progress 
            value={course.progress} 
            className="h-2 mt-1" 
            indicatorClassName={course.name.includes("Mathematics") ? "bg-primary-500" : 
              course.name.includes("English") ? "bg-secondary-500" : 
              "bg-accent-500"}
          />
        </div>
        
        <div className="mt-4">
          <span className="text-xs font-medium text-neutral-500">Next lesson:</span>
          <p className="text-sm font-medium text-neutral-800">{getNextLessonText()}</p>
        </div>
        
        <div className="mt-4 flex justify-between">
          <button 
            onClick={() => setLocation(`/classroom/${course.id}/1`)}
            className="inline-flex items-center px-3 py-1.5 border border-primary-500 text-xs font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500"
          >
            <span>Continue</span>
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </button>
          
          <button 
            onClick={() => setLocation(`/courses`)}
            className="inline-flex items-center px-2 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Course details</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
