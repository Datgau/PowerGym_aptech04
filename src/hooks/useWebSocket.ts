import { useEffect, useRef, useState } from 'react';
import { websocketService, type NotificationMessage } from '../services/websocketService';

export type { NotificationMessage };

interface UseWebSocketOptions {
  onMessage?: (message: NotificationMessage) => void;
  topics?: string[];
  autoConnect?: boolean;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const {
    onMessage,
    topics = ['/topic/admin'],
    autoConnect = true
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<NotificationMessage | null>(null);
  const unsubscribeFunctionsRef = useRef<(() => void)[]>([]);
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    if (!autoConnect || isSubscribedRef.current) return;

    console.log('useWebSocket: Setting up subscriptions for topics:', topics);
    isSubscribedRef.current = true;

    const setupSubscriptions = async () => {
      try {
        const unsubscribeFunctions = await Promise.all(
          topics.map(topic => 
            websocketService.subscribe(topic, (message) => {
              setLastMessage(message);
              onMessage?.(message);
            })
          )
        );
        
        unsubscribeFunctionsRef.current = unsubscribeFunctions;
        setIsConnected(websocketService.isConnected());
      } catch (error) {
        console.error('Failed to setup WebSocket subscriptions:', error);
      }
    };

    setupSubscriptions();

    return () => {
      console.log('useWebSocket: Cleaning up subscriptions for topics:', topics);
      unsubscribeFunctionsRef.current.forEach(unsubscribe => unsubscribe());
      unsubscribeFunctionsRef.current = [];
      isSubscribedRef.current = false;
    };
  }, [autoConnect, ...topics]);

  return {
    isConnected,
    lastMessage,
  };
};
