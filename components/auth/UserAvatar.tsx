"use client";

import React from "react";
import { motion } from "framer-motion";
import { useWindowSize } from "@/hooks/useWindowSize";

interface UserAvatarProps {
  userName: string;
  userEmail: string;
}

export function UserAvatar({ userName, userEmail }: UserAvatarProps) {
  const { isMobile } = useWindowSize();
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}>
        <div style={{
          width: isMobile ? "32px" : "42px",
          height: isMobile ? "32px" : "42px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #00FFFF, #FF00FF)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          color: "#050505",
          fontSize: isMobile ? "14px" : "18px",
          boxShadow: "0 0 10px rgba(0,255,255,0.3)",
          flexShrink: 0,
        }}>
          {initials}
        </div>
        <div>
          <p style={{
            fontWeight: 600,
            color: "#ffffff",
            margin: 0,
            fontSize: "14px",
            whiteSpace: "nowrap",
          }}>
            {userName}
          </p>
          <p style={{
            fontSize: "12px",
            color: "#9ca3af",
            margin: "2px 0 0",
            whiteSpace: "nowrap",
          }}>
            {userEmail}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
