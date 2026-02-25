import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Mic, Settings, Volume2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AudioSensorSettingsProps {
  isPremium: boolean;
}

const AudioSensorSettings: React.FC<AudioSensorSettingsProps> = ({ isPremium }) => {
  const [sensitivity, setSensitivity] = useState<number>(80);
  const [noiseReduction, setNoiseReduction] = useState<boolean>(true);
  const [enhancedAccuracy, setEnhancedAccuracy] = useState<boolean>(false);
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>("default");
  
  // Mock microphone list - in a real app, this would be populated from navigator.mediaDevices.enumerateDevices()
  const microphoneOptions = [
    { id: 'default', label: 'Default Microphone' },
    { id: 'built-in', label: 'Built-in Microphone' },
    { id: 'external', label: 'External Microphone' },
  ];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Audio Sensor Settings</CardTitle>
        </div>
        <CardDescription>
          Configure your breath test recording settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Microphone Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Mic className="h-4 w-4 text-slate-500" />
              Microphone
            </Label>
            <Select value={selectedMicrophone} onValueChange={setSelectedMicrophone}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {microphoneOptions.map(mic => (
                  <SelectItem key={mic.id} value={mic.id}>
                    {mic.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-slate-500">
            Select the microphone you want to use for breath testing
          </p>
        </div>
        
        {/* Sensitivity Setting */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-slate-500" />
              Sensitivity
            </Label>
            <span className="text-sm">{sensitivity}%</span>
          </div>
          <Slider 
            value={[sensitivity]} 
            onValueChange={(vals) => setSensitivity(vals[0])}
            min={40}
            max={100}
            step={1}
          />
          <p className="text-xs text-slate-500">
            Higher sensitivity detects softer breath sounds, but may increase background noise
          </p>
        </div>
        
        {/* Noise Reduction */}
        <div className="flex items-center justify-between space-y-0 rounded-md border p-3">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium">
              Noise Reduction
            </Label>
            <p className="text-xs text-slate-500">
              Filter out background sounds for clearer breath analysis
            </p>
          </div>
          <Switch 
            checked={noiseReduction}
            onCheckedChange={setNoiseReduction}
          />
        </div>
        
        {/* Enhanced Accuracy Option (Premium Feature) */}
        <div className="flex items-center justify-between space-y-0 rounded-md border p-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">
                Enhanced Accuracy
              </Label>
              {!isPremium && (
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded">
                  Premium
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              AI-powered additional processing for more precise BAC measurement
            </p>
          </div>
          <Switch 
            checked={enhancedAccuracy}
            onCheckedChange={setEnhancedAccuracy}
            disabled={!isPremium}
          />
        </div>
        
        <p className="text-xs text-slate-500 italic">
          Note: For most accurate results, find a quiet place and hold your device about 4 inches from your mouth when blowing.
        </p>
      </CardContent>
    </Card>
  );
};

export default AudioSensorSettings;