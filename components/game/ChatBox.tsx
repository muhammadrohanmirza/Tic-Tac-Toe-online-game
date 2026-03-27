"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeonCard } from "@/components/ui/NeonCard";
import { NeonInput } from "@/components/ui/NeonInput";
import { NeonButton } from "@/components/ui/NeonButton";
import { ChatMessage } from "@/types/game";
import { Send, MessageSquare } from "lucide-react";

interface ChatBoxProps {
  messages: ChatMessage[];
  newMessage: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export function ChatBox({ messages, newMessage, onMessageChange, onSendMessage, onKeyPress, disabled = false }: ChatBoxProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (timestamp: number) => new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <NeonCard variant="default" style={{ width: "100%", height: "288px", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <MessageSquare style={{ width: "20px", height: "20px", color: "#00FFFF" }} />
        <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#e5e7eb" }}>Game Chat</h3>
      </div>

      <div style={{ flex: 1, overflowY: "auto", marginBottom: "16px", paddingRight: "8px" }}>
        {messages.length === 0 ? (
          <motion.div style={{ textAlign: "center", padding: "32px 0" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <MessageSquare style={{ width: "48px", height: "48px", color: "#374151", margin: "0 auto 12px" }} />
            <p style={{ color: "#9ca3af", fontSize: "14px" }}>No messages yet. Say hello!</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  maxWidth: "85%",
                  marginBottom: "12px",
                  alignSelf: msg.senderName === "You" ? "flex-end" : msg.isSystem ? "center" : "flex-start",
                  alignItems: msg.isSystem ? "center" : msg.senderName === "You" ? "flex-end" : "flex-start",
                }}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                {msg.isSystem ? (
                  <span style={{ fontSize: "12px", color: "#6b7280", fontStyle: "italic", padding: "4px 12px", backgroundColor: "#1a1a1a", borderRadius: "9999px" }}>{msg.message}</span>
                ) : (
                  <>
                    <div
                      style={{
                        padding: "10px 16px",
                        borderRadius: "16px",
                        fontSize: "14px",
                        fontWeight: 500,
                        backgroundColor: msg.senderName === "You" ? "rgba(0,255,255,0.2)" : "rgba(255,0,255,0.2)",
                        color: msg.senderName === "You" ? "#00FFFF" : "#FF00FF",
                        border: `1px solid ${msg.senderName === "You" ? "#00FFFF33" : "#FF00FF33"}`,
                      }}
                    >
                      <span style={{ fontSize: "11px", opacity: 0.7, marginRight: "8px" }}>{msg.senderName}</span>
                      {msg.message}
                    </div>
                    <span style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px", paddingLeft: "8px" }}>{formatTime(msg.timestamp)}</span>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      <motion.div style={{ display: "flex", gap: "8px" }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <NeonInput
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyPress={onKeyPress}
          variant="cyan"
          disabled={disabled}
          style={{ flex: 1 }}
        />
        <NeonButton variant="cyan" size="md" onClick={onSendMessage} disabled={disabled || !newMessage.trim()} style={{ padding: "12px 16px" }}>
          <Send style={{ width: "20px", height: "20px" }} />
        </NeonButton>
      </motion.div>
    </NeonCard>
  );
}
