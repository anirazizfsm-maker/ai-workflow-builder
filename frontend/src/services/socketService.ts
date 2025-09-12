import { io, Socket } from 'socket.io-client';
import { useAppStore } from '../stores/useAppStore';

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(): void {
    if (this.socket?.connected) return;

    // Get API base URL from environment variables
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
                         import.meta.env.VITE_API_DEV_URL || 
                         'http://localhost:3001';

    this.socket = io(API_BASE_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('workflow-execution-update', (data) => {
      console.log('Workflow execution update:', data);
      // Update the store with the new execution data
      // This would typically update the workflow execution list
    });

    this.socket.on('workflow-status-change', (data) => {
      console.log('Workflow status change:', data);
      // Update the store with the new workflow status
    });

    this.socket.on('analytics-update', (data) => {
      console.log('Analytics update:', data);
      // Update the store with new analytics data
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public emit(event: string, data: any): void {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  public on(event: string, callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  public off(event: string, callback?: (data: any) => void): void {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
      } else {
        this.socket.off(event);
      }
    }
  }
}

export default SocketService.getInstance();