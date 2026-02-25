import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import CourseCard from "@/components/dashboard/course-card";
import ActivityFeed from "@/components/dashboard/activity-feed";
import InstructorCard from "@/components/dashboard/instructor-card";
import { User } from "@/App";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface DashboardProps {
  user: User;
}

const Dashboard = ({ user }: DashboardProps) => {
  const [, setLocation] = useLocation();

  // Fetch user's courses with progress
  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: [`/api/user/${user.id}/progress`],
  });

  // Fetch AI instructors
  const { data: instructors, isLoading: isLoadingInstructors } = useQuery({
    queryKey: [`/api/user/${user.id}/instructors`],
  });

  // Fetch user's activity feed
  const { data: activities, isLoading: isLoadingActivities } = useQuery({
    queryKey: [`/api/user/${user.id}/activity`],
  });

  // Find the course with highest progress
  const currentCourse = courses && courses.length > 0 
    ? courses.reduce((max, course) => course.progress > max.progress ? course : max, courses[0])
    : null;

  if (isLoadingCourses || isLoadingInstructors || isLoadingActivities) {
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
      {/* Welcome Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-neutral-900 font-heading">
          Welcome back, {user.displayName.split(' ')[0]}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Pick up where you left off or explore new learning opportunities
        </p>
      </div>

      {/* Continue Learning Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {currentCourse ? (
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-5 sm:p-6">
              <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Continue your learning journey</h2>
                  <p className="mt-1 text-primary-100 text-sm">
                    You're making great progress! {currentCourse.progress}% complete in {currentCourse.name}.
                  </p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <button 
                    onClick={() => setLocation(`/courses`)} 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-700 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Resume Learning
                  </button>
                </div>
              </div>
              <div className="mt-6 bg-primary-500 bg-opacity-50 rounded-full h-2.5">
                <div 
                  className="bg-white h-2.5 rounded-full" 
                  style={{ width: `${currentCourse.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-5 sm:p-6">
              <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Start your learning journey</h2>
                  <p className="mt-1 text-primary-100 text-sm">
                    Explore our courses and begin learning with AI instructors today.
                  </p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <button 
                    onClick={() => setLocation(`/courses`)} 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-700 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Browse Courses
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity and Ongoing Courses */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column: Activity Feed */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium leading-6 text-neutral-900 font-heading">Recent Activity</h2>
              <ActivityFeed activities={activities || []} />
            </div>
          </div>

          {/* Right Column: Current Courses */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-medium text-neutral-900 mb-4 font-heading">Your Ongoing Courses</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {courses && courses.length > 0 ? (
                courses.slice(0, 3).map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))
              ) : (
                <p className="text-neutral-500">No courses found. Start learning by enrolling in a course.</p>
              )}

              {/* Recommended Course Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg border border-dashed border-neutral-300 transition-all duration-300 hover:shadow-md">
                <div className="relative h-32 bg-neutral-100">
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>
                <div className="px-4 py-4">
                  <h3 className="text-lg font-medium text-neutral-800 font-heading">Discover New Courses</h3>
                  <p className="mt-1 text-sm text-neutral-600">
                    Explore our catalog of subjects and certification programs
                  </p>
                  <div className="mt-4">
                    <button 
                      onClick={() => setLocation('/courses')} 
                      className="inline-flex items-center px-3 py-2 border border-neutral-300 shadow-sm text-sm leading-4 font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Browse catalog
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Instructors Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <h2 className="text-lg font-medium text-neutral-900 mb-4 font-heading">Your AI Instructors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {instructors && instructors.length > 0 ? (
            instructors.slice(0, 3).map((instructor) => (
              <InstructorCard key={instructor.id} instructor={instructor} />
            ))
          ) : (
            <p className="text-neutral-500 col-span-3">No instructors found.</p>
          )}

          {/* Customize AI Instructor */}
          <div className="bg-white shadow rounded-lg overflow-hidden border-2 border-dashed border-primary-300 transition-all duration-300 hover:shadow-md">
            <div className="relative h-40 bg-primary-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-neutral-900 font-heading">Customize Your Instructor</h3>
              <p className="mt-1 text-sm text-neutral-500">Create your own AI instructor with personalized appearance, voice, and style</p>
              <div className="mt-2">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                    Choose appearance
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                    Select voice
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                    Set teaching style
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <button 
                  onClick={() => setLocation('/instructors/customize')}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-primary-500 text-sm font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Custom Instructor
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
