import { useState, useCallback, useRef } from 'react';
import { API_CONFIG, buildApiUrl } from '@/config/api';

export interface SearchUrl {
  url: string;
  title: string;
  content: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  searchUrls?: SearchUrl[];
}

export interface AgentStatus {
  message: string;
  stage: 'initializing' | 'thinking' | 'searching' | 'processing' | 'finalizing';
  tool?: string;
}

export interface UseChatStreamReturn {
  messages: ChatMessage[];
  isGenerating: boolean;
  agentStatus: AgentStatus | null;
  error: string | null;
  sendMessage: (message: string) => void;
  stopGeneration: () => void;
  clearMessages: () => void;
}

export const useChatStream = (
  currentChatId: string | null,
  saveMessage: (msg: ChatMessage) => void
): UseChatStreamReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [agentStatus, setAgentStatus] = useState<AgentStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const currentBotMessageRef = useRef<ChatMessage | null>(null);

  // We don't manage messages state here anymore, it comes from the parent via currentChatId
  // But for the stream logic, we need to know the current messages to append? 
  // Actually, we just need to call saveMessage.

  const sendMessage = useCallback(async (message: string) => {
    if (isGenerating || !message.trim() || !currentChatId) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      isBot: false,
      timestamp: new Date(),
    };

    saveMessage(userMessage);
    setIsGenerating(true);
    setError(null);
    setAgentStatus(null);

    // Create new bot message placeholder
    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: '',
      isBot: true,
      timestamp: new Date(),
    };

    currentBotMessageRef.current = botMessage;
    saveMessage(botMessage);

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(
        buildApiUrl(API_CONFIG.ENDPOINTS.CHAT_STREAM, { message, checkpoint_id: currentChatId }),
        {
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);

            if (data === '[DONE]') {
              setIsGenerating(false);
              setAgentStatus(null);
              return;
            }

            try {
              const parsed = JSON.parse(data);

              if (parsed.type === 'status') {
                setAgentStatus({
                  message: parsed.message,
                  stage: parsed.stage,
                  tool: parsed.tool,
                });
              } else if (parsed.type === 'content') {
                if (currentBotMessageRef.current) {
                  currentBotMessageRef.current.text += parsed.content;
                  saveMessage({ ...currentBotMessageRef.current });
                }
              } else if (parsed.type === 'urls') {
                if (currentBotMessageRef.current) {
                  currentBotMessageRef.current.searchUrls = parsed.urls;
                  saveMessage({ ...currentBotMessageRef.current });
                }
              } else if (parsed.type === 'error') {
                setError(parsed.message);
                setIsGenerating(false);
                setAgentStatus(null);
              }
            } catch (parseError) {
              console.warn('Failed to parse SSE data:', data);
            }
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was aborted, don't show error
        return;
      }

      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);

      // Update the bot message with error
      if (currentBotMessageRef.current) {
        currentBotMessageRef.current.text = `Sorry, I encountered an error: ${errorMessage}`;
        saveMessage({ ...currentBotMessageRef.current });
      }
    } finally {
      setIsGenerating(false);
      setAgentStatus(null);
      abortControllerRef.current = null;
      currentBotMessageRef.current = null;
    }
  }, [isGenerating, currentChatId, saveMessage]);

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsGenerating(false);
    setAgentStatus(null);
  }, []);

  const clearMessages = useCallback(() => {
    // This is now handled by the parent clearing the chat history
    setError(null);
    setAgentStatus(null);
  }, []);

  return {
    messages: [], // Messages are now managed by parent
    isGenerating,
    agentStatus,
    error,
    sendMessage,
    stopGeneration,
    clearMessages,
  };
};
