let socket: WebSocket | null = null;
let messageListeners: Map<string, Function[]> = new Map();
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let isConnecting = false;

export const connectWebSocket = (): WebSocket => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    return socket;
  }

  if (isConnecting) {
    // Return a promise that will resolve when the connection is established
    return new Promise<WebSocket>((resolve) => {
      const checkSocket = setInterval(() => {
        if (socket && socket.readyState === WebSocket.OPEN) {
          clearInterval(checkSocket);
          resolve(socket);
        }
      }, 100);
    }) as any;
  }

  isConnecting = true;
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const wsUrl = `${protocol}//${window.location.host}/ws`;
  
  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    console.log("WebSocket connection established");
    isConnecting = false;
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      const listeners = messageListeners.get(data.type) || [];
      listeners.forEach(listener => listener(data));
    } catch (e) {
      console.error("Error parsing WebSocket message:", e);
    }
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed, attempting to reconnect...");
    isConnecting = false;
    if (!reconnectTimer) {
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        connectWebSocket();
      }, 3000);
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
    isConnecting = false;
  };

  return socket;
};

export const sendMessage = (message: any): void => {
  const ws = connectWebSocket();
  
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  } else {
    // Queue the message to be sent when the connection is open
    ws.addEventListener('open', () => {
      ws.send(JSON.stringify(message));
    });
  }
};

export const addMessageListener = (type: string, callback: Function): void => {
  const listeners = messageListeners.get(type) || [];
  listeners.push(callback);
  messageListeners.set(type, listeners);
};

export const removeMessageListener = (type: string, callback: Function): void => {
  const listeners = messageListeners.get(type) || [];
  const filteredListeners = listeners.filter(listener => listener !== callback);
  messageListeners.set(type, filteredListeners);
};

export const closeWebSocket = (): void => {
  if (socket) {
    socket.close();
    socket = null;
  }
  
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }

  messageListeners.clear();
};
