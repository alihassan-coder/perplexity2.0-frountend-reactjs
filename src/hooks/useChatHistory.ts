import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from './useChatStream';

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
}

export const useChatHistory = () => {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Load chats from local storage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem('perplexity-chats');
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats);
        // Revitalize dates
        const revitalizedChats = parsedChats.map((chat: any) => ({
          ...chat,
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setChats(revitalizedChats);

        // Restore last active chat or create new one if empty
        const lastChatId = localStorage.getItem('perplexity-current-chat-id');
        if (lastChatId && parsedChats.find((c: ChatSession) => c.id === lastChatId)) {
          setCurrentChatId(lastChatId);
        } else if (parsedChats.length > 0) {
          setCurrentChatId(parsedChats[0].id);
        } else {
          createNewChat();
        }
      } catch (e) {
        console.error('Failed to parse chats:', e);
        createNewChat();
      }
    } else {
      createNewChat();
    }
  }, []);

  // Save chats to local storage whenever they change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('perplexity-chats', JSON.stringify(chats));
    }
  }, [chats]);

  // Save current chat ID
  useEffect(() => {
    if (currentChatId) {
      localStorage.setItem('perplexity-current-chat-id', currentChatId);
    }
  }, [currentChatId]);

  const createNewChat = useCallback(() => {
    const newChat: ChatSession = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    return newChat.id;
  }, []);

  const deleteChat = useCallback((chatId: string) => {
    setChats(prev => {
      const newChats = prev.filter(c => c.id !== chatId);
      if (newChats.length === 0) {
        // If we deleted the last chat, create a new one immediately
        // We can't call createNewChat here directly because it depends on setChats
        // So we handle the empty case in the effect or UI
        return [];
      }
      return newChats;
    });

    if (currentChatId === chatId) {
      setCurrentChatId(null); // Will trigger selection logic
    }
  }, [currentChatId]);

  const saveMessageToCurrentChat = useCallback((message: ChatMessage) => {
    if (!currentChatId) return;

    setChats(prev => prev.map(chat => {
      if (chat.id === currentChatId) {
        const updatedMessages = [...chat.messages];
        const existingMsgIndex = updatedMessages.findIndex(m => m.id === message.id);

        if (existingMsgIndex >= 0) {
          updatedMessages[existingMsgIndex] = message;
        } else {
          updatedMessages.push(message);
        }

        // Update title if it's the first user message
        let title = chat.title;
        if (chat.messages.length === 0 && !message.isBot) {
          title = message.text.slice(0, 30) + (message.text.length > 30 ? '...' : '');
        }

        return { ...chat, messages: updatedMessages, title };
      }
      return chat;
    }));
  }, [currentChatId]);

  const clearCurrentChat = useCallback(() => {
    if (!currentChatId) return;
    setChats(prev => prev.map(chat =>
      chat.id === currentChatId ? { ...chat, messages: [] } : chat
    ));
  }, [currentChatId]);

  return {
    chats,
    currentChatId,
    setCurrentChatId,
    createNewChat,
    deleteChat,
    saveMessageToCurrentChat,
    clearCurrentChat
  };
};
