import { GameMessage } from '@/types';

class WebSocketService {
  private ws: WebSocket | null = null;
  private messageHandlers: ((message: GameMessage) => void)[] = [];

  connect(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        resolve();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };

      this.ws.onmessage = (event) => {
        try {
          const message: GameMessage = JSON.parse(event.data);
          this.messageHandlers.forEach(handler => handler(message));
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        // Attempt to reconnect after 5 seconds
        setTimeout(() => this.connect(url), 5000);
      };
    });
  }

  send(message: GameMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  addMessageHandler(handler: (message: GameMessage) => void): void {
    this.messageHandlers.push(handler);
  }

  removeMessageHandler(handler: (message: GameMessage) => void): void {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsService = new WebSocketService();
