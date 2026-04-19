import { useState, useCallback } from "react";
import { Message, Mode, ConversationState } from "@/types/chat";
import { aiApi, demoResponse } from "@/services/api";

const API_BASE = "http://localhost:3000";

const createEmptyConversation = () => ({
  messages: [] as Message[],
  systemPrompt: "",
  isLoading: false,
});

const initialState: ConversationState = {
  chat: createEmptyConversation(),
  text: createEmptyConversation(),
  image: createEmptyConversation(),
  file: createEmptyConversation(),
};

function makeId() {
  return crypto.randomUUID();
}

export function useChat() {
  const [state, setState] = useState<ConversationState>(initialState);
  const [activeMode, setActiveMode] = useState<Mode>("chat");

  const conversation = state[activeMode];

  const setSystemPrompt = useCallback((prompt: string) => {
    setState((prev) => ({
      ...prev,
      [activeMode]: { ...prev[activeMode], systemPrompt: prompt },
    }));
  }, [activeMode]);

  const sendMessage = useCallback(
    async (content: string, imageUrl?: string, fileName?: string) => {
      const userMsg: Message = {
        id: makeId(),
        role: "user",
        content,
        timestamp: new Date(),
        imageUrl,
        fileName,
      };

      setState((prev) => ({
        ...prev,
        [activeMode]: {
          ...prev[activeMode],
          messages: [...prev[activeMode].messages, userMsg],
          isLoading: true,
        },
      }));

      try {
        let reply: string;

        if (activeMode === "chat") {
          const currentMessages = state[activeMode].messages;
          const chatMessages = [...currentMessages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          }));
          const res = await aiApi.chat(chatMessages);
          reply = res.message;
        } else {
          const res = await aiApi.ask(content);
          reply = res.message;
        }

        const assistantMsg: Message = {
          id: makeId(),
          role: "assistant",
          content: reply,
          timestamp: new Date(),
        };

        setState((prev) => ({
          ...prev,
          [activeMode]: {
            ...prev[activeMode],
            messages: [...prev[activeMode].messages, assistantMsg],
            isLoading: false,
          },
        }));
      } catch (error) {
        console.error("Error:", error);
        const errorMsg: Message = {
          id: makeId(),
          role: "assistant",
          content: "Error connecting to backend",
          timestamp: new Date(),
        };
        setState((prev) => ({
          ...prev,
          [activeMode]: {
            ...prev[activeMode],
            messages: [...prev[activeMode].messages, errorMsg],
            isLoading: false,
          },
        }));
      }
    },
    [activeMode, state]
  );

  const clearChat = useCallback(() => {
    setState((prev) => ({
      ...prev,
      [activeMode]: createEmptyConversation(),
    }));
  }, [activeMode]);

  const exportChat = useCallback(() => {
    const data = JSON.stringify(conversation.messages, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-${activeMode}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [conversation.messages, activeMode]);

  return {
    state,
    activeMode,
    setActiveMode,
    conversation,
    setSystemPrompt,
    sendMessage,
    clearChat,
    exportChat,
  };
}