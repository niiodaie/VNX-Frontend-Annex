import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Loader2, AlertCircle } from "lucide-react";
import { useLocation } from "@/hooks/useLocation";
import { useTranslation } from "@/hooks/useTranslation";

interface LocationDetectorProps {
  onLocationDetected?: (location: { latitude: number; longitude: number; city?: string; country?: string }) => void;
}

export default function LocationDetector({ onLocationDetected }: LocationDetectorProps) {
  const { location, loading, error, detectLocation } = useLocation();
  const { t } = useTranslation();

  const handleDetectLocation = async () => {
    await detectLocation();
    if (location && onLocationDetected) {
      onLocationDetected(location);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {location ? t('locationDetected') : 'Location Services'}
              </h3>
              {location && (
                <p className="text-sm text-gray-600">
                  {location.city && location.country 
                    ? `${location.city}, ${location.country}`
                    : `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`
                  }
                </p>
              )}
              {error && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {t('locationError')}
                </p>
              )}
            </div>
          </div>
          
          <Button
            onClick={handleDetectLocation}
            disabled={loading}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4 mr-1" />
            )}
            {loading ? 'Detecting...' : t('detectLocation')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}