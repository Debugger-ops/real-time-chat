import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSocket } from './useSocket';
import { Chat, Message } from '../types/chat';

export const useChat = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { socket } = useSocket();
  const params = useParams();
  const router = useRouter();
  const chatId = params?.chatId as string;

  // Fetch all chats for the user
  const fetchChats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/chats');
      
      if (!response.ok) {
        throw new Error('Failed to fetch chats');
      }
      
      const data = await response.json();
      setChats(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a specific chat's messages
  const fetchMessages = useCallback(async (chatId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/chats/${chatId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      
      const data = await response.json();
      setCurrentChat(data.chat);
      setMessages(data.messages);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new chat
  const createChat = useCallback(async (participantIds: string[]) => {
    setLoading(true);
    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantIds }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create chat');
      }
      
      const data = await response.json();
      router.push(`/chat/${data.id}`);
      setChats(prev => [...prev, data]);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Send a new message
  const sendMessage = useCallback(async (content: string) => {
    if (!chatId) return null;
    
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, content }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, [chatId]);

  // Handle real-time message updates
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
      if (message.chatId === chatId) {
        setMessages(prev => [...prev, message]);
      }
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, chatId]);

  // Load chat data when chatId changes
  useEffect(() => {
    if (chatId) {
      fetchMessages(chatId);
    }
  }, [chatId, fetchMessages]);

  // Initial fetch of all chats
  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return {
    chats,
    currentChat,
    messages,
    loading,
    error,
    fetchChats,
    fetchMessages,
    createChat,
    sendMessage,
    setError
  };
};