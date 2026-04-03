
import { Client, type StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface NotificationMessage {
  entityName: string;
  action: string;
  message: string;
  data: any;
  entityId: number | null;
  timestamp: string;
}

type MessageCallback = (message: NotificationMessage) => void;

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private messageCallbacks: Map<string, Set<MessageCallback>> = new Map();
  private isConnecting = false;
  private isConnectedState = false;
  private connectionPromise: Promise<void> | null = null;

  connect(): Promise<void> {
    if (this.isConnectedState) {
      return Promise.resolve();
    }

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    if (this.isConnecting) {
      return new Promise((resolve) => {
        const checkConnection = setInterval(() => {
          if (this.isConnectedState) {
            clearInterval(checkConnection);
            resolve();
          }
        }, 100);
      });
    }

    this.isConnecting = true;

    this.connectionPromise = new Promise((resolve, reject) => {
      this.client = new Client({
        webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
        debug: (str) => {
          console.log('STOMP Debug:', str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        onConnect: () => {
          console.log('✅ WebSocket connected (Singleton)');
          this.isConnectedState = true;
          this.isConnecting = false;
          resolve();
        },
        onDisconnect: () => {
          console.log('❌ WebSocket disconnected (Singleton)');
          this.isConnectedState = false;
          this.subscriptions.clear();
        },
        onStompError: (frame) => {
          console.error('❌ WebSocket error:', frame.headers['message']);
          this.isConnecting = false;
          reject(new Error(frame.headers['message']));
        },
      });

      this.client.activate();
    });

    return this.connectionPromise;
  }

  async subscribe(topic: string, callback: MessageCallback): Promise<() => void> {
    await this.connect();

    if (!this.client) {
      throw new Error('WebSocket client not initialized');
    }

    // Add callback to the set for this topic
    if (!this.messageCallbacks.has(topic)) {
      this.messageCallbacks.set(topic, new Set());
    }
    this.messageCallbacks.get(topic)!.add(callback);

    // Subscribe to topic if not already subscribed
    if (!this.subscriptions.has(topic)) {
      console.log('📡 Subscribing to topic:', topic);
      const subscription = this.client.subscribe(topic, (message) => {
        try {
          const notification: NotificationMessage = JSON.parse(message.body);
          console.log('📩 Message received on topic:', topic, notification);
          
          // Notify all callbacks for this topic
          const callbacks = this.messageCallbacks.get(topic);
          if (callbacks) {
            callbacks.forEach(cb => cb(notification));
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });
      this.subscriptions.set(topic, subscription);
      console.log('✅ Subscribed to:', topic);
    } else {
      console.log('ℹ️ Already subscribed to:', topic, '- adding callback');
    }

    // Return unsubscribe function
    return () => {
      const callbacks = this.messageCallbacks.get(topic);
      if (callbacks) {
        callbacks.delete(callback);
        
        // If no more callbacks for this topic, unsubscribe
        if (callbacks.size === 0) {
          this.messageCallbacks.delete(topic);
          const subscription = this.subscriptions.get(topic);
          if (subscription) {
            console.log('🔌 Unsubscribing from:', topic);
            subscription.unsubscribe();
            this.subscriptions.delete(topic);
          }
        }
      }
    };
  }

  disconnect() {
    if (this.client) {
      console.log('🔌 Disconnecting WebSocket');
      this.subscriptions.forEach(sub => sub.unsubscribe());
      this.subscriptions.clear();
      this.messageCallbacks.clear();
      this.client.deactivate();
      this.client = null;
      this.isConnectedState = false;
      this.connectionPromise = null;
    }
  }

  isConnected(): boolean {
    return this.isConnectedState;
  }
}

// Singleton instance
export const websocketService = new WebSocketService();
