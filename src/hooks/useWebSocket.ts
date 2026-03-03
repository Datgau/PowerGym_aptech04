import { useEffect, useRef, useState } from 'react';
import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface NotificationMessage {
  entityName: string;
  action: string;
  message: string;
  data: any;
  entityId: number | null;
  timestamp: string;
}

interface UseWebSocketOptions {
  onMessage?: (message: NotificationMessage) => void;
  topics?: string[];
  autoConnect?: boolean;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const {
    onMessage,
    topics = ['/topic/global'],
    autoConnect = true
  } = options;

  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<StompSubscription[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<NotificationMessage | null>(null);
  const isConnectingRef = useRef(false);

  useEffect(() => {
    if (!autoConnect || isConnectingRef.current) return;

    isConnectingRef.current = true;
    
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      debug: () => {}, // Disable debug logs
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        setIsConnected(true);

        // Subscribe to topics
        topics.forEach(topic => {
          const subscription = client.subscribe(topic, (message) => {
            try {
              const notification: NotificationMessage = JSON.parse(message.body);
              setLastMessage(notification);
              onMessage?.(notification);
            } catch (error) {
              console.error('Error parsing WebSocket message:', error);
            }
          });
          subscriptionsRef.current.push(subscription);
        });
      },
      onDisconnect: () => {
        setIsConnected(false);
      },
      onStompError: (frame) => {
        console.error('WebSocket error:', frame.headers['message']);
      },
    });

    client.activate();
    clientRef.current = client;

    // Cleanup on unmount
    return () => {
      subscriptionsRef.current.forEach(sub => sub.unsubscribe());
      subscriptionsRef.current = [];
      client.deactivate();
      isConnectingRef.current = false;
    };
  }, []);

  return {
    isConnected,
    lastMessage,
  };
};
