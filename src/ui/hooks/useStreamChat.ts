import { useState, useRef } from "react";
import { Message } from "../components/modules/conversation/conversation.types";
import { useStore } from "./useStore";

interface UseStreamChatProps {
  appendMessage: (message: Message, conversationId: string) => void;
  createConversation: () => string;
  activeConversationId: string | null;
  activeConversation: { messages: Message[] } | null;
}

interface StreamResponse {
  content: string;
  isConnected: boolean;
  error: string | null;
  handleStream: (message: string, startTime: number) => Promise<void>;
  setContent: (content: string) => void;
  cancelStream: () => void;
}

export const useStreamChat = ({
  appendMessage,
  createConversation,
  activeConversationId,
  activeConversation,
}: UseStreamChatProps): StreamResponse => {
  const { setContent, setIsConnected, isConnected, content } = useStore();
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const cancelStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsConnected(false);
      setError("Stream cancelled by user");
    }
  };

  const sanitizeMessages = (messages: Message[]) => {
    return messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));
  };

  const handleStream = async (message: string, startTime: number) => {
    let currentConversationId = activeConversationId;
    if (!currentConversationId) {
      currentConversationId = createConversation();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setIsConnected(true);
      setError(null);
      setContent("");

      const conversationHistory = activeConversation?.messages || [];
      const messages: Message[] = [
        ...conversationHistory,
        {
          role: "user",
          content: message,
          timestamp: new Date().toISOString(),
        },
      ];

      console.log("This is messages", messages);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/api/chat/stream`,
        {
          method: "POST",
          body: JSON.stringify({
            model: {
              company: "openai",
              model: "gpt-4o",
            },
            messages: sanitizeMessages(messages),
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_PRIME_AI_API_KEY}`,
          },
          signal: controller.signal,
        }
      );

      console.log("This is response", response);

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Response body is null");

      const decoder = new TextDecoder();
      let buffer = "";

      setIsConnected(true);

      while (true) {
        const { value, done } = await reader.read();

        console.log("This is value", value);

        if (done) {
          const duration = Date.now() - startTime;
          if (currentConversationId) {
            appendMessage(
              {
                role: "user",
                content: message,
              },
              currentConversationId
            );
            appendMessage(
              {
                role: "assistant",
                content: buffer,
                duration,
              },
              currentConversationId
            );
          }

          setIsConnected(false);
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        setContent(buffer);
      }
    } catch (err) {
      console.log("Error happpppeeeened: ");
      console.log(err);
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          setError("Stream cancelled");
          return;
        }
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setIsConnected(false);
    }
  };

  return {
    setContent,
    content,
    isConnected,
    error,
    handleStream,
    cancelStream,
  };
};
