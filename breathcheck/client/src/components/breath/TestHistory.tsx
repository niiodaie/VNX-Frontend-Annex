import React from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, CalendarDays } from "lucide-react";
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { BreathTest } from '@shared/schema';

interface TestHistoryProps {
  tests: BreathTest[];
}

interface LevelIndicatorProps {
  level: string;
}

const LevelIndicator: React.FC<LevelIndicatorProps> = ({ level }) => {
  const config = {
    safe: {
      bgClass: 'bg-signalmint',
      textClass: 'text-signalmint',
      label: 'Safe',
    },
    warning: {
      bgClass: 'bg-yellow-400',
      textClass: 'text-yellow-400',
      label: 'Caution',
    },
    danger: {
      bgClass: 'bg-crimson',
      textClass: 'text-crimson',
      label: 'Danger',
    },
  };

  const levelConfig = config[level as keyof typeof config] || config.safe;

  return (
    <div className="flex items-center gap-2">
      <div className={`h-3 w-3 rounded-full ${levelConfig.bgClass} shadow-sm`}></div>
      <span className={`text-xs font-medium ${levelConfig.textClass}`}>{levelConfig.label}</span>
    </div>
  );
};

const TestHistory: React.FC<TestHistoryProps> = ({ tests }) => {
  const [, setLocation] = useLocation();
  
  if (tests.length === 0) {
    return (
      <Card className="border-midnight bg-carbon">
        <CardHeader className="bg-midnight border-b border-midnight">
          <CardTitle className="text-lg flex items-center gap-2 text-fogwhite">
            <BarChart className="h-5 w-5 text-breathteal" />
            Test History
          </CardTitle>
          <CardDescription className="text-coolgray">Your breath test records</CardDescription>
        </CardHeader>
        <CardContent className="py-8">
          <div className="text-center py-6 text-coolgray">
            <p>No test history available</p>
            <Button 
              variant="outline" 
              className="mt-4 border-breathteal text-breathteal hover:bg-breathteal/10"
              onClick={() => setLocation('/scan')}
            >
              Take Your First Test
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="border-midnight bg-carbon">
      <CardHeader className="pb-3 bg-midnight border-b border-midnight">
        <CardTitle className="text-lg flex items-center gap-2 text-fogwhite">
          <BarChart className="h-5 w-5 text-breathteal" />
          Test History
        </CardTitle>
        <CardDescription className="text-coolgray">Your recent breath test records</CardDescription>
      </CardHeader>
      <CardContent className="py-4">
        <div className="space-y-3">
          {tests.map((test) => (
            <div 
              key={test.id} 
              className="flex items-center justify-between p-4 border border-midnight rounded-md hover:bg-midnight/70 cursor-pointer transition-colors"
              onClick={() => setLocation(`/result?id=${test.id}`)}
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-breathteal opacity-70" />
                  <span className="text-sm text-coolgray">
                    {format(new Date(test.createdAt), 'MMM d, yyyy - h:mm a')}
                  </span>
                </div>
                <div className="flex gap-4 items-baseline">
                  <span className={`text-lg font-bold ${
                    test.level === 'safe' 
                      ? 'text-signalmint' 
                      : test.level === 'warning' 
                      ? 'text-yellow-400' 
                      : 'text-crimson'
                  }`}>
                    {test.bac.toFixed(3)}%
                  </span>
                  <LevelIndicator level={test.level} />
                </div>
              </div>
              <div className="text-breathteal mr-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          ))}
          
          {tests.length > 0 && (
            <Button 
              variant="ghost" 
              className="w-full mt-2 text-breathteal hover:bg-midnight/50" 
              onClick={() => setLocation('/history')}
            >
              View All History
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestHistory;