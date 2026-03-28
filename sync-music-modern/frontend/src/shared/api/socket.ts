import { WS_URL } from './config';

class SocketService {
  public socket: WebSocket | null = null;
  private listeners: Record<string, Function[]> = {};

  connect() {
    if (this.socket) return;
    this.socket = new WebSocket(WS_URL);

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type && this.listeners[data.type]) {
          this.listeners[data.type].forEach(cb => cb(data));
        }
      } catch (e) {
        console.error('Failed to parse WS message', e);
      }
    };

    this.socket.onopen = () => console.log('WebSocket connected');
    this.socket.onclose = () => {
      console.log('WebSocket disconnected. Reconnecting...');
      this.socket = null;
      setTimeout(() => this.connect(), 2000);
    };
  }

  send(type: string, payload: any = {}) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, ...payload }));
    }
  }

  on(type: string, callback: Function) {
    if (!this.listeners[type]) this.listeners[type] = [];
    this.listeners[type].push(callback);
  }

  off(type: string, callback: Function) {
    if (!this.listeners[type]) return;
    this.listeners[type] = this.listeners[type].filter(cb => cb !== callback);
  }
}

export const socketApi = new SocketService();