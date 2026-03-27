"use client";

import React, { forwardRef, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

interface NeonInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: "cyan" | "pink" | "green" | "yellow" | "red" | "purple";
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

export const NeonInput = forwardRef<HTMLInputElement, NeonInputProps>(
  function NeonInput(
    {
      label,
      error,
      variant = "cyan",
      icon,
      showPasswordToggle = false,
      type = "text",
      className = "",
      style,
      ...props
    },
    ref
  ) {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const variantColors: Record<string, string> = {
      cyan: "#00FFFF",
      pink: "#FF00FF",
      green: "#00FF41",
      yellow: "#FFD700",
      red: "#FF3131",
      purple: "#BF00FF",
    };

    const color = variantColors[variant];
    const inputType = showPasswordToggle ? (showPassword ? "text" : "password") : type;

    return (
      <div style={{ width: "100%" }}>
        {label && (
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: 500,
              marginBottom: "8px",
              color: isFocused ? color : "#9ca3af",
              transition: "color 0.3s",
            }}
          >
            {label}
          </label>
        )}
        <div style={{ position: "relative" }}>
          {icon && (
            <div
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: isFocused ? color : "#6b7280",
                transition: "color 0.3s",
              }}
            >
              {icon}
            </div>
          )}
          <input
            type={inputType}
            ref={ref}
            style={{
              width: "100%",
              padding: icon ? "12px 16px 12px 48px" : showPasswordToggle ? "12px 48px 12px 16px" : "12px 16px",
              backgroundColor: "#0a0a0a",
              border: `1px solid ${error ? "#FF3131" : "#333"}`,
              borderRadius: "8px",
              color: "white",
              outline: "none",
              fontSize: "14px",
              transition: "border-color 0.3s, box-shadow 0.3s",
              boxShadow: isFocused && !error ? `0 0 12px ${color}44` : "none",
              borderColor: isFocused && !error ? color : error ? "#FF3131" : "#333",
              ...style,
            }}
            className={className}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#6b7280",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
        </div>
        {error && (
          <motion.p
            style={{
              marginTop: "8px",
              fontSize: "14px",
              color: "#FF3131",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span
              style={{
                display: "inline-block",
                width: "4px",
                height: "4px",
                backgroundColor: "#FF3131",
                borderRadius: "50%",
              }}
            />
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);
