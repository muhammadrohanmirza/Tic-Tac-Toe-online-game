"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ChatMessage } from "@/types/game";

interface UseChatReturn {
  messages: ChatMessage[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  sendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  clearMessages: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function useChat(
  onSendMessage?: (message: string) => void
): Omit<UseChatReturn, 'setMessages'> {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(() => {
    if (newMessage.trim() && onSendMessage) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  }, [newMessage, onSendMessage]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
    handleKeyPress,
    clearMessages,
    messagesEndRef,
  };
}
