import { useEffect, useRef, useState } from "react";
import { queryClient } from "../lib/queryClient";

export function useWebSocket() {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const connect = () => {
      ws.current = new WebSocket(wsUrl);
      
      ws.current.onopen = () => {
        console.log("Connected to real-time updates");
        setIsConnected(true);
      };
      
      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'trendsUpdate') {
            // Invalidate and refetch trends data
            queryClient.invalidateQueries({ queryKey: ['/api/trends'] });
            queryClient.invalidateQueries({ queryKey: ['/api/trends/countries'] });
            setLastUpdate(new Date());
            console.log("Trend data update received");
          } else if (data.type === 'metricsUpdate') {
            // Invalidate metrics-related queries
            queryClient.invalidateQueries({ queryKey: ['/api/insights'] });
            console.log("Live metrics update received");
          } else if (data.type === 'activityUpdate') {
            // Activity feed updates don't need cache invalidation
            console.log("Activity feed update:", data.data?.message);
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };
      
      ws.current.onclose = () => {
        console.log("Disconnected from real-time updates");
        setIsConnected(false);
        
        // Attempt to reconnect after 5 seconds
        setTimeout(connect, 5000);
      };
      
      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
      };
    };
    
    connect();
    
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  return { isConnected, lastUpdate };
}