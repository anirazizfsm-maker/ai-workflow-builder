import { useEffect, useRef } from 'react';
import SocketService from '../services/socketService';

export const useSocket = () => {
  const socketRef = useRef(SocketService);

  useEffect(() => {
    // Connect to socket when component mounts
    socketRef.current.connect();

    // Disconnect when component unmounts
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return socketRef.current;
};

export const useSocketListener = (event: string, callback: (data: any) => void) => {
  const socket = useSocket();

  useEffect(() => {
    // Add event listener
    socket.on(event, callback);

    // Remove event listener when component unmounts
    return () => {
      socket.off(event, callback);
    };
  }, [event, callback, socket]);
};