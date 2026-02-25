import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { User } from "@/App";
import { Loader2, Award, FileText, Clock, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CertificationsProps {
  user: User;
}

interface CertificationCourse {
  id: number;
  name: string;
  description: string;
  certificationType: string;
  imageUrl: string;
  progress: number;
  examDate?: string;
  nextMilestone?: string;
}

const Certifications = ({ user }: CertificationsProps) => {
  const [, setLocation] = useLocation();

  // Fetch certification courses
  const { data: certificationCourses, isLoading } = useQuery({
    queryKey: [`/api/user/${user.id}/certifications`],
    queryFn: async () => {
      // Since we don't have a specific endpoint for certifications yet,
      // we'll use the courses endpoint and filter for certification courses
      const response = await fetch(`/api/user/${user.id}/progress`);
      if (!response.ok) {
        throw new Error('Failed to fetch certifications');
      }
      const courses = await response.json();
      return courses.filter((course: any) => course.certificationType);
    }
  });

  if (isLoading) {
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 font-heading">
              Certification Programs
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Prepare for your exams with personalized study plans and practice tests
            </p>
          </div>
          <Button 
            onClick={() => setLocation('/courses')}
            variant="outline"
          >
            Explore All Certifications
          </Button>
        </div>

        {/* Certification Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Current Programs</CardTitle>
              <CardDescription>Your active certification tracks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {certificationCourses?.length || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Practice Tests Completed</CardTitle>
              <CardDescription>Total practice exams taken</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {/* In a real app, this would come from the API */}
                3
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Average Score</CardTitle>
              <CardDescription>Across all practice tests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {/* In a real app, this would come from the API */}
                78%
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          {/* Current Certifications */}
          <TabsContent value="current">
            {certificationCourses?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {certificationCourses.map((course: CertificationCourse) => (
                  <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-neutral-200">
                    <div className="relative h-36 bg-gradient-to-br from-accent-600 to-accent-800">
                      {course.imageUrl && (
                        <img 
                          src={course.imageUrl} 
                          alt={course.name} 
                          className="w-full h-full object-cover opacity-80"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-3 right-3">
                        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2">
                          <Award className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-lg font-semibold text-white font-heading">
                          {course.name}
                        </h3>
                        <div className="flex items-center mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent-100 text-accent-800">
                            {course.certificationType} Certification
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="mb-4">
                        <div className="flex justify-between items-center text-sm mb-1">
                          <span className="text-neutral-500">Overall Progress</span>
                          <span className="font-medium text-neutral-800">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-start">
                          <Calendar className="h-5 w-5 text-neutral-500 mr-2 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-neutral-800">
                              Target Exam Date
                            </p>
                            <p className="text-xs text-neutral-500">
                              {course.examDate || "Not scheduled"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Clock className="h-5 w-5 text-neutral-500 mr-2 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-neutral-800">
                              Next Milestone
                            </p>
                            <p className="text-xs text-neutral-500">
                              {course.nextMilestone || "Full Practice Test #2"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <FileText className="h-5 w-5 text-neutral-500 mr-2 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-neutral-800">
                              Practice Tests
                            </p>
                            <p className="text-xs text-neutral-500">
                              2 completed, 3 remaining
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <Button
                          className="flex-1"
                          onClick={() => setLocation(`/classroom/${course.id}/1`)}
                        >
                          Continue Prep
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            // In a real app, this would navigate to a dedicated exam page
                            alert("This would start a practice test");
                          }}
                        >
                          Take Practice Test
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 mt-4 bg-white rounded-lg border border-neutral-200">
                <div className="mx-auto w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-medium text-neutral-800">No certification programs started</h3>
                <p className="text-neutral-500 mt-1 mb-4">
                  Enroll in a certification program to prepare for your exams
                </p>
                <Button
                  onClick={() => {
                    document.querySelector('[value="available"]')?.dispatchEvent(
                      new MouseEvent('click', { bubbles: true })
                    );
                  }}
                >
                  Explore Certifications
                </Button>
              </div>
            )}
          </TabsContent>
          
          {/* Available Certifications */}
          <TabsContent value="available">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle>SAT Preparation</CardTitle>
                  <CardDescription>Comprehensive SAT exam preparation</CardDescription>
                </CardHeader>
                <CardContent>
                  <img 
                    src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173" 
                    alt="SAT Preparation" 
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                  <div className="space-y-2">
                    <p className="text-sm text-neutral-700">
                      Complete preparation for all sections of the SAT exam with practice tests and strategies.
                    </p>
                    <div className="flex items-center text-sm text-neutral-500">
                      <Clock className="h-4 w-4 mr-1" />
                      12-week program
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    Enroll Now
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle>IELTS Preparation</CardTitle>
                  <CardDescription>English language proficiency exam prep</CardDescription>
                </CardHeader>
                <CardContent>
                  <img 
                    src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1" 
                    alt="IELTS Preparation" 
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                  <div className="space-y-2">
                    <p className="text-sm text-neutral-700">
                      Prepare for all four sections of IELTS: Reading, Writing, Listening and Speaking.
                    </p>
                    <div className="flex items-center text-sm text-neutral-500">
                      <Clock className="h-4 w-4 mr-1" />
                      8-week program
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    Enroll Now
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle>GRE Preparation</CardTitle>
                  <CardDescription>Graduate Record Examination prep</CardDescription>
                </CardHeader>
                <CardContent>
                  <img 
                    src="https://images.unsplash.com/photo-1491308056676-205b7c9a7dc1" 
                    alt="GRE Preparation" 
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                  <div className="space-y-2">
                    <p className="text-sm text-neutral-700">
                      Comprehensive preparation for Verbal, Quantitative and Analytical Writing sections.
                    </p>
                    <div className="flex items-center text-sm text-neutral-500">
                      <Clock className="h-4 w-4 mr-1" />
                      10-week program
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    Enroll Now
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* Completed Certifications */}
          <TabsContent value="completed">
            <div className="text-center py-12 mt-4 bg-white rounded-lg border border-neutral-200">
              <div className="mx-auto w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-medium text-neutral-800">No completed certifications yet</h3>
              <p className="text-neutral-500 mt-1 mb-4">
                Your completed certification programs will appear here
              </p>
              <Button
                onClick={() => {
                  document.querySelector('[value="current"]')?.dispatchEvent(
                    new MouseEvent('click', { bubbles: true })
                  );
                }}
              >
                Continue Current Programs
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Certifications;
