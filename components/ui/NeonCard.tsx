"use client";

import React from "react";
import { motion } from "framer-motion";

interface NeonCardProps {
  variant?: "cyan" | "pink" | "green" | "yellow" | "red" | "purple" | "default";
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  glow?: boolean;
  hover?: boolean;
}

export function NeonCard({
  variant = "default",
  children,
  className = "",
  style,
  glow = false,
  hover = false,
}: NeonCardProps) {
  const variantColors: Record<string, { border: string; bg: string; shadow: string }> = {
    default: { border: "#1a1a1a", bg: "rgba(13,13,13,0.8)", shadow: "none" },
    cyan: { border: "#00FFFF44", bg: "rgba(0,255,255,0.05)", shadow: "0 0 20px rgba(0,255,255,0.2)" },
    pink: { border: "#FF00FF44", bg: "rgba(255,0,255,0.05)", shadow: "0 0 20px rgba(255,0,255,0.2)" },
    green: { border: "#00FF4144", bg: "rgba(0,255,65,0.05)", shadow: "0 0 20px rgba(0,255,65,0.2)" },
    yellow: { border: "#FFD70044", bg: "rgba(255,215,0,0.05)", shadow: "0 0 20px rgba(255,215,0,0.2)" },
    red: { border: "#FF313144", bg: "rgba(255,49,49,0.05)", shadow: "0 0 20px rgba(255,49,49,0.2)" },
    purple: { border: "#BF00FF44", bg: "rgba(191,0,255,0.05)", shadow: "0 0 20px rgba(191,0,255,0.2)" },
  };

  const colors = variantColors[variant];

  return (
    <motion.div
      style={{
        padding: "24px",
        borderRadius: "16px",
        backgroundColor: colors.bg,
        backdropFilter: "blur(10px)",
        border: `1px solid ${colors.border}`,
        boxShadow: glow ? colors.shadow : "none",
        transition: "all 0.3s ease",
        ...style,
      }}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      {...(hover
        ? {
            whileHover: {
              borderColor: colors.border.replace("44", "88"),
              boxShadow: colors.shadow,
              scale: 1.02,
            },
          }
        : {})}
    >
      {children}
    </motion.div>
  );
}
