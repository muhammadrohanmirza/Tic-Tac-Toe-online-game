"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";

interface NeonButtonProps extends HTMLMotionProps<"button"> {
  variant?: "cyan" | "pink" | "green" | "yellow" | "red" | "purple" | "default";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
  glow?: boolean;
}

export function NeonButton({
  variant = "default",
  size = "md",
  isLoading = false,
  children,
  className = "",
  disabled,
  fullWidth = false,
  glow = true,
  ...props
}: NeonButtonProps) {
  const baseStyles: React.CSSProperties = {
    background: "transparent",
    border: "2px solid",
    borderRadius: "12px",
    fontWeight: 600,
    cursor: disabled || isLoading ? "not-allowed" : "pointer",
    opacity: disabled || isLoading ? 0.5 : 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: fullWidth ? "100%" : "auto",
    transition: "all 0.3s ease",
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: "8px 16px", fontSize: "14px" },
    md: { padding: "12px 24px", fontSize: "16px" },
    lg: { padding: "16px 32px", fontSize: "18px" },
    xl: { padding: "20px 40px", fontSize: "20px" },
  };

  const variantStyles: Record<string, { color: string; hoverBg: string; shadow: string }> = {
    default: { color: "#ffffff", hoverBg: "rgba(255,255,255,0.1)", shadow: "0 0 10px rgba(255,255,255,0.2)" },
    cyan: { color: "#00FFFF", hoverBg: "rgba(0,255,255,0.1)", shadow: "0 0 15px rgba(0,255,255,0.3)" },
    pink: { color: "#FF00FF", hoverBg: "rgba(255,0,255,0.1)", shadow: "0 0 15px rgba(255,0,255,0.3)" },
    green: { color: "#00FF41", hoverBg: "rgba(0,255,65,0.1)", shadow: "0 0 15px rgba(0,255,65,0.3)" },
    yellow: { color: "#FFD700", hoverBg: "rgba(255,215,0,0.1)", shadow: "0 0 15px rgba(255,215,0,0.3)" },
    red: { color: "#FF3131", hoverBg: "rgba(255,49,49,0.1)", shadow: "0 0 15px rgba(255,49,49,0.3)" },
    purple: { color: "#BF00FF", hoverBg: "rgba(191,0,255,0.1)", shadow: "0 0 15px rgba(191,0,255,0.3)" },
  };

  const style = variantStyles[variant];

  return (
    <motion.button
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        borderColor: style.color,
        color: style.color,
        boxShadow: glow && !disabled ? style.shadow : "none",
        ...props.style,
      }}
      className={className}
      disabled={disabled || isLoading}
      whileHover={!disabled && !isLoading ? { scale: 1.03, y: -2 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.97 } : {}}
      onMouseEnter={(e) => {
        if (!disabled && !isLoading) {
          e.currentTarget.style.background = style.hoverBg;
          e.currentTarget.style.boxShadow = style.shadow;
          e.currentTarget.style.transform = "translateY(-2px)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.boxShadow = glow && !disabled ? style.shadow : "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
      {...props}
    >
      {isLoading ? (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Loader2 className="w-5 h-5" style={{ animation: "spin 1s linear infinite" }} />
          <span>Loading...</span>
        </div>
      ) : (
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {children}
        </span>
      )}
    </motion.button>
  );
}
