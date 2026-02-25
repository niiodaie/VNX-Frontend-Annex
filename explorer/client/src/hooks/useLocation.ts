import { useState, useEffect } from 'react';

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

interface LocationState {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
}

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    location: null,
    loading: false,
    error: null
  });

  const detectLocation = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    if (!navigator.geolocation) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Geolocation is not supported by this browser' 
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use a reverse geocoding service to get city/country
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          
          if (response.ok) {
            const data = await response.json();
            setState({
              location: {
                latitude,
                longitude,
                city: data.city || data.locality,
                country: data.countryName
              },
              loading: false,
              error: null
            });
          } else {
            setState({
              location: { latitude, longitude },
              loading: false,
              error: null
            });
          }
        } catch (error) {
          setState({
            location: { latitude, longitude },
            loading: false,
            error: null
          });
        }
      },
      (error) => {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Location access denied or unavailable' 
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000 // 10 minutes
      }
    );
  };

  return {
    ...state,
    detectLocation
  };
}