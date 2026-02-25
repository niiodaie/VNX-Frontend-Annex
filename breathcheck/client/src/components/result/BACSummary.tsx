import { Card, CardContent } from "@/components/ui/card";
import { Shield, AlertTriangle, AlertCircle } from "lucide-react";

interface BACSummaryProps {
  bac: string;
  level: "safe" | "warning" | "danger";
  message: string;
}

const BACSummary = ({ bac, level, message }: BACSummaryProps) => {
  const getStatusIcon = () => {
    switch (level) {
      case "safe":
        return <Shield className="h-12 w-12 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-12 w-12 text-amber-500" />;
      case "danger":
        return <AlertCircle className="h-12 w-12 text-red-500" />;
      default:
        return <Shield className="h-12 w-12 text-green-500" />;
    }
  };
  
  const getStatusColor = () => {
    switch (level) {
      case "safe":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-amber-50 border-amber-200";
      case "danger":
        return "bg-red-50 border-red-200";
      default:
        return "bg-green-50 border-green-200";
    }
  };
  
  const getStatusTextColor = () => {
    switch (level) {
      case "safe":
        return "text-green-800";
      case "warning":
        return "text-amber-800";
      case "danger":
        return "text-red-800";
      default:
        return "text-green-800";
    }
  };
  
  const getStatusLabel = () => {
    switch (level) {
      case "safe":
        return "Safe";
      case "warning":
        return "Warning";
      case "danger":
        return "Danger";
      default:
        return "Safe";
    }
  };

  return (
    <Card className={`${getStatusColor()}`}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          {getStatusIcon()}
          
          <div className="mt-4 mb-2">
            <span className="text-xl font-bold block mb-1 tracking-tight">
              BAC Level: {bac}%
            </span>
            <span className={`text-lg font-semibold block ${getStatusTextColor()}`}>
              {getStatusLabel()}
            </span>
          </div>
          
          <p className={`text-sm ${getStatusTextColor()} mt-2`}>
            {message}
          </p>
          
          <div className="w-full bg-white/50 h-10 rounded-full mt-6 overflow-hidden">
            <div className="w-full h-full flex">
              <div 
                className="bg-green-500 h-full flex-1 flex items-center justify-center text-xs font-medium text-white"
                style={{ maxWidth: level === "safe" ? "100%" : "33%" }}
              >
                {level === "safe" && "SAFE"}
              </div>
              <div 
                className="bg-amber-500 h-full flex-1 flex items-center justify-center text-xs font-medium text-white"
                style={{ 
                  maxWidth: level === "safe" ? "0%" : level === "warning" ? "34%" : "33%",
                  opacity: level === "safe" ? 0.3 : 1 
                }}
              >
                {level === "warning" && "WARNING"}
              </div>
              <div 
                className="bg-red-500 h-full flex-1 flex items-center justify-center text-xs font-medium text-white"
                style={{ 
                  maxWidth: level === "danger" ? "100%" : "33%",
                  opacity: level === "danger" ? 1 : 0.3 
                }}
              >
                {level === "danger" && "DANGER"}
              </div>
            </div>
          </div>
          
          <div className="w-full flex justify-between mt-1 text-xs text-muted-foreground">
            <span>0.00%</span>
            <span>0.08%</span>
            <span>0.20%+</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BACSummary;
