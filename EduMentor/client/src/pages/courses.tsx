import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { User } from "@/App";
import { Loader2, ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface CoursesProps {
  user: User;
}

interface Subject {
  id: number;
  name: string;
  code: string;
  description: string;
  imageUrl: string;
  color: string;
}

interface Course {
  id: number;
  name: string;
  description: string;
  subjectId: number;
  level: string;
  imageUrl: string;
  certificationType: string | null;
  progress?: number;
}

const Courses = ({ user }: CoursesProps) => {
  const [, setLocation] = useLocation();
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);

  // Fetch all subjects
  const { data: subjects, isLoading: isLoadingSubjects } = useQuery({
    queryKey: ['/api/subjects'],
  });

  // Fetch user's courses with progress
  const { data: userCourses, isLoading: isLoadingUserCourses } = useQuery({
    queryKey: [`/api/user/${user.id}/progress`],
  });

  // Fetch all courses or courses filtered by subject
  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ['/api/courses', selectedSubject],
    queryFn: async () => {
      const url = selectedSubject ? `/api/courses?subjectId=${selectedSubject}` : '/api/courses';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      return response.json();
    },
  });

  // Merge user progress with course data
  const coursesWithProgress = courses?.map((course: Course) => {
    const userCourse = userCourses?.find((uc: Course) => uc.id === course.id);
    return {
      ...course,
      progress: userCourse?.progress || 0
    };
  });

  const handleStartCourse = (courseId: number) => {
    // In a real app, there might be an enrollment process first
    // Find the first lesson for this course
    setLocation(`/classroom/${courseId}/1`);
  };

  const handleContinueCourse = (courseId: number) => {
    // In a real app, we'd find the last accessed lesson
    setLocation(`/classroom/${courseId}/1`);
  };

  if (isLoadingSubjects || isLoadingUserCourses || isLoadingCourses) {
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
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-neutral-900 font-heading">
          Course Catalog
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Browse our collection of courses and certification programs
        </p>

        <div className="mt-6">
          <Tabs defaultValue="all-courses" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all-courses">All Courses</TabsTrigger>
              <TabsTrigger value="my-courses">My Courses</TabsTrigger>
            </TabsList>
            
            <div className="mt-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  variant={selectedSubject === null ? "default" : "outline"}
                  className="text-sm"
                  onClick={() => setSelectedSubject(null)}
                >
                  All Subjects
                </Button>
                {subjects?.map((subject: Subject) => (
                  <Button
                    key={subject.id}
                    variant={selectedSubject === subject.id ? "default" : "outline"}
                    className="text-sm"
                    onClick={() => setSelectedSubject(subject.id)}
                    style={{ 
                      backgroundColor: selectedSubject === subject.id ? subject.color : 'transparent',
                      borderColor: selectedSubject !== subject.id ? subject.color : 'transparent',
                      color: selectedSubject === subject.id ? 'white' : subject.color
                    }}
                  >
                    {subject.name}
                  </Button>
                ))}
              </div>
            </div>

            <TabsContent value="all-courses" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coursesWithProgress?.map((course: Course) => (
                  <div key={course.id} className="bg-white rounded-lg shadow overflow-hidden transition-all duration-300 hover:shadow-md">
                    <div className="h-40 bg-gradient-to-br from-primary-600 to-primary-800 relative">
                      {course.imageUrl && (
                        <img
                          src={course.imageUrl}
                          alt={course.name}
                          className="w-full h-full object-cover opacity-80"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-lg font-semibold text-white font-heading">
                          {course.name}
                        </h3>
                        <p className="text-white/80 text-sm">
                          {course.description.length > 60 
                            ? `${course.description.substring(0, 60)}...` 
                            : course.description}
                        </p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" className="text-xs capitalize">
                          {course.level}
                        </Badge>
                        {course.certificationType && (
                          <Badge className="bg-accent-500 text-white text-xs">
                            {course.certificationType} Certification
                          </Badge>
                        )}
                      </div>
                      
                      {course.progress > 0 ? (
                        <>
                          <div className="mb-2">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-neutral-500">Progress</span>
                              <span className="font-medium text-neutral-800">{course.progress}%</span>
                            </div>
                            <div className="mt-1 w-full bg-neutral-200 rounded-full h-2">
                              <div 
                                className="bg-primary-500 h-2 rounded-full" 
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                          </div>
                          <Button 
                            className="w-full mt-3"
                            onClick={() => handleContinueCourse(course.id)}
                          >
                            Continue Learning
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button 
                          className="w-full mt-3"
                          onClick={() => handleStartCourse(course.id)}
                        >
                          Start Course
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="my-courses" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userCourses?.filter((course: Course) => course.progress > 0).length > 0 ? (
                  userCourses
                    .filter((course: Course) => course.progress > 0)
                    .map((course: Course) => (
                      <div key={course.id} className="bg-white rounded-lg shadow overflow-hidden transition-all duration-300 hover:shadow-md">
                        <div className="h-40 bg-gradient-to-br from-primary-600 to-primary-800 relative">
                          {course.imageUrl && (
                            <img
                              src={course.imageUrl}
                              alt={course.name}
                              className="w-full h-full object-cover opacity-80"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-lg font-semibold text-white font-heading">
                              {course.name}
                            </h3>
                            <p className="text-white/80 text-sm">
                              {course.description && course.description.length > 60 
                                ? `${course.description.substring(0, 60)}...` 
                                : course.description}
                            </p>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="mb-2">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-neutral-500">Progress</span>
                              <span className="font-medium text-neutral-800">{course.progress}%</span>
                            </div>
                            <div className="mt-1 w-full bg-neutral-200 rounded-full h-2">
                              <div 
                                className="bg-primary-500 h-2 rounded-full" 
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                          </div>
                          <Button 
                            className="w-full mt-3"
                            onClick={() => handleContinueCourse(course.id)}
                          >
                            Continue Learning
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="col-span-3 text-center py-10">
                    <div className="mx-auto w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-neutral-800">No courses started yet</h3>
                    <p className="text-neutral-500 mt-1 mb-4">Start learning by enrolling in one of our courses</p>
                    <Button
                      onClick={() => {
                        document.querySelector('[value="all-courses"]')?.dispatchEvent(
                          new MouseEvent('click', { bubbles: true })
                        );
                      }}
                    >
                      Browse Courses
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Courses;
