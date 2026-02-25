import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CalendarClock } from "lucide-react";

interface MetabolismCalculatorProps {
  initialBAC: number;
}

interface ChartPoint {
  time: number; // hours
  bac: number;
}

const MetabolismCalculator: React.FC<MetabolismCalculatorProps> = ({ initialBAC }) => {
  const [weight, setWeight] = useState<number>(70); // kg
  const [gender, setGender] = useState<string>("male");
  const [metabolismRate, setMetabolismRate] = useState<number>(0.015); // Default metabolism rate per hour
  const [timeToSober, setTimeToSober] = useState<number>(0);
  const [predictedPoints, setPredictedPoints] = useState<ChartPoint[]>([]);
  
  // Calculate metabolism based on inputs
  useEffect(() => {
    // Base metabolism rate varies by gender and weight
    let baseRate = gender === "male" ? 0.015 : 0.017; // Women metabolize alcohol slightly faster
    
    // Adjust rate based on weight (simplified model)
    const weightFactor = weight / 70; // Normalize around 70kg
    const adjustedRate = baseRate * (0.8 + (0.4 * weightFactor));
    
    setMetabolismRate(Number(adjustedRate.toFixed(4)));
  }, [weight, gender]);
  
  // Calculate time to sober and prediction points
  useEffect(() => {
    if (initialBAC <= 0) {
      setTimeToSober(0);
      setPredictedPoints([]);
      return;
    }
    
    // Time to sober (hours) = initial BAC / metabolism rate
    const hours = initialBAC / metabolismRate;
    setTimeToSober(Number(hours.toFixed(2)));
    
    // Generate data points for chart
    const points: ChartPoint[] = [];
    const totalHours = Math.ceil(hours);
    
    for (let i = 0; i <= totalHours; i += 0.5) {
      const remainingBAC = Math.max(0, initialBAC - (metabolismRate * i));
      points.push({
        time: i,
        bac: Number(remainingBAC.toFixed(3))
      });
    }
    
    setPredictedPoints(points);
  }, [initialBAC, metabolismRate]);
  
  // Format time in hours and minutes
  const formatTime = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (hours < 0.01) {
      return 'You are sober';
    }
    
    if (wholeHours === 0) {
      return `${minutes} minutes`;
    }
    
    if (minutes === 0) {
      return `${wholeHours} hour${wholeHours !== 1 ? 's' : ''}`;
    }
    
    return `${wholeHours} hour${wholeHours !== 1 ? 's' : ''} and ${minutes} minutes`;
  };
  
  // Get the legal driving time (when BAC falls below 0.08%)
  const getLegalDrivingTime = (): string => {
    if (initialBAC <= 0.08) {
      return 'You are under the legal limit';
    }
    
    const hoursToLegal = (initialBAC - 0.08) / metabolismRate;
    return formatTime(hoursToLegal);
  };
  
  return (
    <Card className="overflow-hidden border-midnight bg-carbon">
      <CardHeader className="bg-midnight pb-4 border-b border-midnight">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-breathteal" />
          <CardTitle className="text-lg text-fogwhite">Metabolism Calculator</CardTitle>
        </div>
        <CardDescription className="text-coolgray">
          Predict how your body will process alcohol over time
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div>
          <div className="flex justify-between mb-3 items-center">
            <Label className="text-sm font-medium text-fogwhite">Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="w-[140px] border-midnight bg-midnight text-fogwhite">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-midnight border-breathteal/30 text-fogwhite">
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-between mb-6 items-center">
            <Label className="text-sm font-medium text-fogwhite">Weight (kg)</Label>
            <div className="flex items-center gap-2">
              <Slider 
                value={[weight]} 
                onValueChange={(vals) => setWeight(vals[0])}
                min={40}
                max={120}
                step={1}
                className="w-[140px]"
              />
              <span className="w-10 text-right text-sm text-breathteal font-semibold">{weight}</span>
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="bg-midnight rounded-lg p-4 border border-breathteal/30">
              <p className="text-sm font-medium text-breathteal">Current BAC:</p>
              <p className="text-2xl font-bold text-fogwhite">{initialBAC.toFixed(3)}%</p>
            </div>
            
            <div className="bg-midnight/50 rounded-lg p-4 border border-midnight">
              <p className="text-sm font-medium text-coolgray">Metabolism Rate:</p>
              <p className="text-sm text-fogwhite">{metabolismRate.toFixed(4)}% per hour</p>
            </div>
            
            <div className="bg-safe/20 rounded-lg p-4 border border-signalmint/30">
              <p className="text-sm font-medium text-fogwhite">Estimated time until sober:</p>
              <p className="text-lg font-medium text-signalmint">{formatTime(timeToSober)}</p>
            </div>
            
            {initialBAC > 0.08 && (
              <div className="bg-warning/20 rounded-lg p-4 border border-yellow-400/30">
                <p className="text-sm font-medium text-fogwhite">Time until legally able to drive:</p>
                <p className="text-lg font-medium text-yellow-400">{getLegalDrivingTime()}</p>
              </div>
            )}
          </div>
          
          {/* Mini chart of predicted BAC over time */}
          {predictedPoints.length > 0 && (
            <div className="pt-4 pb-2">
              <p className="text-sm font-medium mb-3 text-fogwhite">BAC Reduction Timeline:</p>
              <div className="bg-midnight p-4 rounded-lg border border-midnight">
                <div className="h-20 relative w-full border-b border-l border-coolgray/30">
                  {/* Y axis label (left) */}
                  <div className="absolute -left-7 top-0 text-xs text-breathteal font-mono">{initialBAC.toFixed(3)}</div>
                  <div className="absolute -left-7 bottom-0 text-xs text-coolgray font-mono">0.000</div>
                  
                  {/* Legal line */}
                  {initialBAC > 0.08 && (
                    <div 
                      className="absolute border-t border-dashed border-crimson/70 left-0 right-0 z-10"
                      style={{ top: `${(1 - (0.08 / initialBAC)) * 100}%` }}
                    >
                      <span className="absolute -right-16 -top-2 text-xs text-crimson font-medium bg-carbon/70 px-1 py-0.5 rounded">Legal (0.08)</span>
                    </div>
                  )}
                  
                  {/* The chart itself */}
                  <div className="absolute inset-0">
                    <svg width="100%" height="100%" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="bacGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgb(255, 59, 48)" /> {/* crimson */}
                          <stop offset="60%" stopColor="rgb(255, 179, 0)" /> {/* yellow */}
                          <stop offset="100%" stopColor="rgb(61, 255, 155)" /> {/* signalmint */}
                        </linearGradient>
                      </defs>
                      
                      {/* Line */}
                      <polyline
                        points={predictedPoints.map(point => `${(point.time / timeToSober) * 100}%,${(1 - (point.bac / initialBAC)) * 100}%`).join(' ')}
                        fill="none"
                        stroke="url(#bacGradient)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      
                      {/* Area under the line */}
                      <polygon
                        points={`
                          0,100% 
                          ${predictedPoints.map(point => `${(point.time / timeToSober) * 100}%,${(1 - (point.bac / initialBAC)) * 100}%`).join(' ')} 
                          100%,100%
                        `}
                        fill="url(#bacGradient)"
                        fillOpacity="0.15"
                      />
                    </svg>
                  </div>
                  
                  {/* X axis labels (hours) */}
                  <div className="absolute left-0 -bottom-5 text-xs text-coolgray font-mono">0h</div>
                  <div className="absolute right-0 -bottom-5 text-xs text-coolgray font-mono">{Math.ceil(timeToSober)}h</div>
                </div>
              </div>
            </div>
          )}
          
          <div className="text-xs text-coolgray mt-5 bg-midnight/30 p-3 rounded-md border border-midnight">
            Note: This is an estimate based on average metabolism rates. Individual factors like food consumption, 
            sleep, and overall health can affect actual alcohol metabolism.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetabolismCalculator;