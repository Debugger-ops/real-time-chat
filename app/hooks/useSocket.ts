"use client";
import { useState, useEffect, useContext } from 'react';
import { useSession } from 'next-auth/react';
import { io, Socket } from 'socket.io-client';
import { SocketContext, SocketContextType } from '../context/SocketContext';

export const useSocket = () => {
  const socketContext = useContext(SocketContext) as SocketContextType | null;
  const { socket: contextSocket, connected: contextConnected } = socketContext || {};
  
  const [socket, setSocket] = useState<Socket | null>(contextSocket || null);
  const [connected, setConnected] = useState<boolean>(contextConnected || false);
  const [error, setError] = useState<string | null>(null);
  
  const { data: session, status } = useSession();

  // Initialize socket connection when user is authenticated
  useEffect(() => {
    if (socket || status !== 'authenticated' || !session?.user?.id) return;

    try {
      const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || '', {
        auth: {
          userId: session.user.id,
          token: session.accessToken || '',
        },
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketInstance.on('connect', () => {
        setConnected(true);
        setError(null);
      });

      socketInstance.on('connect_error', (err: Error) => {
        console.error('Socket connection error:', err.message);
        setError(`Connection error: ${err.message}`);
        setConnected(false);
      });

      socketInstance.on('disconnect', (reason: string) => {
        console.log('Socket disconnected:', reason);
        setConnected(false);
        if (reason === 'io server disconnect') {
          socketInstance.connect();
        }
      });

      socketInstance.on('error', (err: Error) => {
        console.error('Socket error:', err);
        setError(`Socket error: ${err.message}`);
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
        setSocket(null);
        setConnected(false);
      };
    } catch (err: any) {
      console.error('Error setting up socket:', err);
      setError(`Socket setup error: ${err.message}`);
    }
  }, [session, status, socket]);

  const reconnect = () => {
    if (socket) {
      socket.connect();
    }
  };

  const disconnect = () => {
    if (socket && connected) {
      socket.disconnect();
      setConnected(false);
    }
  };

  const joinChat = (chatId: string) => {
    if (socket && connected) {
      socket.emit('joinChat', { chatId });
    }
  };

  const leaveChat = (chatId: string) => {
    if (socket && connected) {
      socket.emit('leaveChat', { chatId });
    }
  };

  const sendTyping = (chatId: string, isTyping: boolean) => {
    if (socket && connected) {
      socket.emit('typing', { chatId, isTyping });
    }
  };

  return {
    socket,
    connected,
    error,
    reconnect,
    disconnect,
    joinChat,
    leaveChat,
    sendTyping,
    setError,
  };
};
