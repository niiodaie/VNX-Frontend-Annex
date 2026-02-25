import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { getBreathTestHistory } from '@/lib/breathalyzer-api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import TestHistory from '@/components/breath/TestHistory';
import { Loader2, ArrowRight, Beaker, Leaf, Calendar, Award, ChevronsUpDown, Zap, Shield } from "lucide-react";

// Demo userId for now
const DEMO_USER_ID = 1;

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, onClick }) => (
  <Card className="overflow-hidden">
    <CardHeader className="p-4">
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 p-2 rounded-md">
          {icon}
        </div>
        <CardTitle className="text-base">{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="p-4 pt-0">
      <CardDescription>{description}</CardDescription>
    </CardContent>
    {onClick && (
      <CardFooter className="p-0">
        <Button 
          variant="ghost" 
          className="w-full rounded-t-none flex justify-between"
          onClick={onClick}
        >
          <span>Try it</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    )}
  </Card>
);

export default function HomeScreen() {
  const [, setLocation] = useLocation();
  
  // Fetch breath test history
  const { data: testHistory, isLoading } = useQuery({
    queryKey: [`/api/users/${DEMO_USER_ID}/breath-tests`],
    queryFn: () => getBreathTestHistory(DEMO_USER_ID)
  });

  const handleStartTest = () => {
    setLocation('/scan');
  };

  const handleShowResult = () => {
    setLocation('/result');
  };

  const handleSubscription = () => {
    setLocation('/subscription');
  };
  
  const handleTeenMode = () => {
    setLocation('/teen-mode');
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Breathalyzer</h1>
          <p className="text-slate-500">Your personal breath analysis tool</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-bold text-xl">Start Test</h2>
                <p className="text-slate-500 text-sm">Measure your BAC level</p>
              </div>
              <Button onClick={handleStartTest} size="lg">
                <Beaker className="mr-2 h-4 w-4" />
                Test Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          testHistory && <TestHistory tests={testHistory} />
        )}

        <div className="pt-4">
          <h2 className="font-bold text-xl mb-4">Features</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Use the features from the image you shared */}
            <FeatureCard
              icon={<ChevronsUpDown className="h-5 w-5 text-primary" />}
              title="Sound Visualization"
              description="See your breath audio pattern in real-time"
            />
            <FeatureCard
              icon={<Zap className="h-5 w-5 text-primary" />}
              title="AI Voice Feedback"
              description="Get voice responses after your test"
              onClick={handleSubscription}
            />
            <FeatureCard
              icon={<Calendar className="h-5 w-5 text-primary" />}
              title="Test History"
              description="Track your results over time"
            />
            <FeatureCard
              icon={<Award className="h-5 w-5 text-primary" />}
              title="Gamification"
              description="Earn points for consistent testing"
              onClick={handleSubscription}
            />
            <FeatureCard
              icon={<Shield className="h-5 w-5 text-primary" />}
              title="Teen Driver Mode"
              description="Monitor and protect young drivers"
              onClick={handleTeenMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}