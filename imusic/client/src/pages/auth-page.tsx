import { useEffect } from "react";
import { Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form";

export default function AuthPage() {
  const { user, isLoading } = useAuth();

  // Redirect to home if already logged in
  if (user && !isLoading) {
    return <Redirect to="/home" />;
  }

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      {/* Left side - Forms */}
      <div className="flex flex-col justify-center w-full p-6 md:p-12 md:w-1/2">
        <div className="max-w-lg mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-bold font-['Playfair_Display']">
              <span className="text-primary">Dark</span>Notes
            </h1>
            <p className="mt-2 text-gray-400">Where raw thoughts become real sound</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right side - Hero section */}
      <div className="hidden md:block md:w-1/2 bg-[#1a1a1a] notebook-bg relative purple-light-effect texture-overlay">
        <div className="absolute inset-0 flex flex-col justify-center p-12 z-10">
          <div className="max-w-lg mx-auto">
            <h2 className="text-3xl font-bold mb-6 font-['Playfair_Display'] text-white">Get mentored by your favorite artists</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-purple-700 w-8 h-8 rounded-full flex items-center justify-center mt-1">
                  {/* SVG microphone icon */}
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-white">
                    <path fill="currentColor" d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-lg text-white">AI Mentor Clones</h3>
                  <p className="text-gray-400">Work 1-on-1 with AI mentors inspired by top artists</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-purple-700 w-8 h-8 rounded-full flex items-center justify-center mt-1">
                  {/* SVG path icon */}
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-white">
                    <path fill="currentColor" d="M9,6H5V10H7V8H9M19,10H17V12H15V14H19M21,16H3V4H21M3,2A2,2 0 0,0 1,4V16A2,2 0 0,0 3,18H10V20H8V22H16V20H14V18H21A2,2 0 0,0 23,16V4A2,2 0 0,0 21,2" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-lg text-white">Personalized Journey</h3>
                  <p className="text-gray-400">Step-by-step guidance to grow your music skills</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-purple-700 w-8 h-8 rounded-full flex items-center justify-center mt-1">
                  {/* SVG users icon */}
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-white">
                    <path fill="currentColor" d="M16,13C15.71,13 15.38,13 15.03,13.05C16.19,13.89 17,15 17,16.5V19H23V16.5C23,14.17 18.33,13 16,13M8,13C5.67,13 1,14.17 1,16.5V19H15V16.5C15,14.17 10.33,13 8,13M8,11A3,3 0 0,0 11,8A3,3 0 0,0 8,5A3,3 0 0,0 5,8A3,3 0 0,0 8,11M16,11A3,3 0 0,0 19,8A3,3 0 0,0 16,5A3,3 0 0,0 13,8A3,3 0 0,0 16,11Z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-lg text-white">Collab & Connect</h3>
                  <p className="text-gray-400">Find other artists to collaborate with</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-[#2D2D2D] rounded-lg notebook-bg border border-gray-800">
              <p className="italic text-gray-300">"DarkNotes transformed my creative process. The AI mentor feedback is like having a pro in your corner 24/7."</p>
              <p className="mt-2 font-bold text-purple-300">— Jordan K, Independent Artist</p>
            </div>
          </div>
        </div>
        
        {/* SVG silhouette background */}
        <div className="absolute right-0 bottom-0 h-96 w-72 opacity-20">
          <svg viewBox="0 0 300 500" className="w-full h-full">
            <defs>
              <linearGradient id="authGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#6D28D9" />
              </linearGradient>
            </defs>
            <path 
              d="M180,50 C250,50 300,120 300,200 C300,280 270,320 240,350 C210,380 200,390 200,410 C200,430 200,450 180,470 C160,490 130,490 110,470 C90,450 90,430 90,410 C90,390 80,380 50,350 C20,320 -10,280 -10,200 C-10,120 110,50 180,50 Z" 
              fill="url(#authGradient)"
              opacity="0.6"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
