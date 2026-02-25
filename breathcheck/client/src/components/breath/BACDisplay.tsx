import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cva } from "class-variance-authority";

interface BACDisplayProps {
  bac: string;
  level: "safe" | "warning" | "danger";
  message: string;
}

const levelVariants = cva("", {
  variants: {
    level: {
      safe: "bg-safe border-signalmint/30",
      warning: "bg-warning border-yellow-400/30",
      danger: "bg-danger border-crimson/30",
    },
  },
  defaultVariants: {
    level: "safe",
  },
});

const textVariants = cva("font-bold text-center", {
  variants: {
    level: {
      safe: "text-signalmint",
      warning: "text-yellow-400",
      danger: "text-crimson",
    },
  },
  defaultVariants: {
    level: "safe",
  },
});

const BACDisplay: React.FC<BACDisplayProps> = ({ bac, level, message }) => {
  return (
    <Card className={`border-2 overflow-hidden ${levelVariants({ level })}`}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-medium">Your Blood Alcohol Content</h3>
            <p className={`text-4xl font-bold ${textVariants({ level })}`}>
              {bac}%
            </p>
          </div>
          
          <div className="w-full bg-midnight h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full ${
                level === 'safe' 
                  ? 'bg-signalmint' 
                  : level === 'warning' 
                  ? 'bg-yellow-400' 
                  : 'bg-crimson'
              }`}
              style={{ 
                width: `${Math.min(parseFloat(bac) * 100 * 5, 100)}%` 
              }}
            />
          </div>
          
          <div className="flex justify-between w-full text-xs text-coolgray px-1">
            <span>0.00%</span>
            <span>0.08%</span>
            <span>0.20%+</span>
          </div>
          
          <StatusIndicator level={level} message={message} />
        </div>
      </CardContent>
    </Card>
  );
};

interface StatusIndicatorProps {
  level: "safe" | "warning" | "danger";
  message: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ level, message }) => {
  const statusConfig = {
    safe: {
      title: "Safe",
      icon: "✓",
      bgColor: "bg-safe",
      textColor: "text-signalmint",
      borderColor: "border-signalmint/30",
    },
    warning: {
      title: "Caution",
      icon: "!",
      bgColor: "bg-warning",
      textColor: "text-yellow-400",
      borderColor: "border-yellow-400/30",
    },
    danger: {
      title: "Danger",
      icon: "×",
      bgColor: "bg-danger",
      textColor: "text-crimson",
      borderColor: "border-crimson/30",
    },
  };
  
  const config = statusConfig[level];
  
  return (
    <div className={`w-full p-4 rounded-lg ${config.bgColor} border ${config.borderColor}`}>
      <div className="flex items-center gap-3">
        <div className={`flex items-center justify-center h-7 w-7 rounded-full ${config.textColor} bg-midnight font-bold text-lg`}>
          {config.icon}
        </div>
        <div>
          <h4 className={`font-medium ${config.textColor}`}>{config.title}</h4>
          <p className="text-sm text-fogwhite/90">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default BACDisplay;