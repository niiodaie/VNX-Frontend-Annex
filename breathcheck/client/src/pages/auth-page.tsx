import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LockKeyhole, Smartphone, Mail, User2 } from "lucide-react";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("login");
  
  const handleGoBack = () => {
    setLocation('/');
  };
  
  const handleSubmitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo version - just redirect to home
    setLocation('/');
  };
  
  const handleSubmitRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo version - just redirect to home
    setLocation('/');
  };
  
  return (
    <div className="flex flex-col">
      <div className="flex-1 container max-w-screen-xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8">
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-3">Welcome to Breathalyzer</h1>
          <p className="text-slate-500 mb-8">
            Your personal breath analysis tool for accurate BAC measurement.
            Join our community of responsible users and get detailed insights
            into your breath test results.
          </p>
          
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <form onSubmit={handleSubmitLogin}>
                  <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                      Enter your credentials to access your test history.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input 
                          id="email" 
                          placeholder="your@email.com" 
                          type="email" 
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <button type="button" className="text-xs text-primary hover:underline">
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input 
                          id="password" 
                          placeholder="••••••••" 
                          type="password" 
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    <Button type="submit" className="w-full">Login</Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full"
                      onClick={handleGoBack}
                    >
                      Back to Home
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <form onSubmit={handleSubmitRegister}>
                  <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>
                      Register to save your test history and access premium features.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input 
                          id="name" 
                          placeholder="John Doe" 
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input 
                          id="register-email" 
                          placeholder="your@email.com" 
                          type="email" 
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input 
                          id="phone" 
                          placeholder="(123) 456-7890" 
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <div className="relative">
                        <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input 
                          id="register-password" 
                          placeholder="••••••••" 
                          type="password" 
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    <Button type="submit" className="w-full">Register</Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full"
                      onClick={handleGoBack}
                    >
                      Back to Home
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="hidden md:flex flex-col justify-center">
          <div className="bg-primary/10 rounded-lg p-8 text-center h-full flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-4">Breathalyzer App</h2>
            <div className="max-w-sm mx-auto mb-6">
              <p className="text-slate-600 mb-4">
                Get accurate blood alcohol content measurements using your smartphone's microphone.
              </p>
              <p className="text-slate-600 mb-4">
                Track your results over time with detailed history and analytics.
              </p>
              <p className="text-slate-600">
                Premium features include AI voice feedback, gamification rewards, and more.
              </p>
            </div>
            <div className="text-center mt-auto">
              <p className="text-sm text-slate-500">Powered by Visnec</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}