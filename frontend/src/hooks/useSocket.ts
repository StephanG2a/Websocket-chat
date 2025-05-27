import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message, ConnectedUser } from '@/types';

export const useSocket = (token: string | null) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
        setMessages([]);
        setConnectedUsers([]);
      }
      return;
    }

    const newSocket = io('http://localhost:3001', {
      auth: {
        token,
      },
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    newSocket.on('recentMessages', (recentMessages: Message[]) => {
      setMessages(recentMessages);
    });

    newSocket.on('newMessage', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('userConnected', (data: { user: ConnectedUser; connectedUsers: ConnectedUser[] }) => {
      setConnectedUsers(data.connectedUsers);
    });

    newSocket.on('userDisconnected', (data: { user: ConnectedUser; connectedUsers: ConnectedUser[] }) => {
      setConnectedUsers(data.connectedUsers);
    });

    newSocket.on('connectedUsers', (users: ConnectedUser[]) => {
      setConnectedUsers(users);
    });

    newSocket.on('messageError', (error: { error: string }) => {
      console.error('Message error:', error.error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  const sendMessage = (message: string) => {
    if (socket && isConnected) {
      socket.emit('sendMessage', { message });
    }
  };

  const getConnectedUsers = () => {
    if (socket && isConnected) {
      socket.emit('getConnectedUsers');
    }
  };

  const getRecentMessages = () => {
    if (socket && isConnected) {
      socket.emit('getRecentMessages');
    }
  };

  return {
    socket,
    messages,
    connectedUsers,
    isConnected,
    sendMessage,
    getConnectedUsers,
    getRecentMessages,
  };
}; 