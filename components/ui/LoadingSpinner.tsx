"use client";

import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "cyan" | "pink" | "green" | "yellow" | "red" | "purple";
  className?: string;
  text?: string;
  showIcon?: boolean;
}

export function LoadingSpinner({
  size = "md",
  variant = "cyan",
  className = "",
  text,
  showIcon = true,
}: LoadingSpinnerProps) {
  const variantColors: Record<string, string> = {
    cyan: "#00FFFF",
    pink: "#FF00FF",
    green: "#00FF41",
    yellow: "#FFD700",
    red: "#FF3131",
    purple: "#BF00FF",
  };

  const sizeValues: Record<string, number> = {
    sm: 16,
    md: 32,
    lg: 48,
    xl: 64,
  };

  const color = variantColors[variant];
  const sizePx = sizeValues[size];

  return (
    <motion.div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
      }}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {showIcon ? (
        <div
          style={{
            width: sizePx,
            height: sizePx,
            borderRadius: "50%",
            border: `4px solid ${color}`,
            borderTopColor: "transparent",
            animation: "spin 1s linear infinite",
          }}
        />
      ) : (
        <Loader2
          style={{
            width: sizePx / 4,
            height: sizePx / 4,
            color,
            animation: "spin 1s linear infinite",
          }}
        />
      )}
      {text && (
        <motion.p
          style={{
            color: "#9ca3af",
            fontSize: "14px",
            fontWeight: 500,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );
}
