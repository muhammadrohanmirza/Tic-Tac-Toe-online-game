"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import CountUp from "react-countup";
import { Timer } from "lucide-react";

interface TurnTimerProps {
  secondsLeft: number;
  isActive: boolean;
  isMyTurn: boolean;
}

export function TurnTimer({ secondsLeft, isActive, isMyTurn }: TurnTimerProps) {
  const percentage = (secondsLeft / 30) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (secondsLeft > 15) return { color: "#00FF41", glow: "shadow-neon-green" };
    if (secondsLeft > 5) return { color: "#FFD700", glow: "shadow-neon-yellow" };
    return { color: "#FF3131", glow: "shadow-neon-red" };
  };

  const { color } = getColor();
  const isFlashing = secondsLeft <= 5 && secondsLeft > 0;

  return (
    <motion.div style={{ width: "100%", maxWidth: "320px", margin: "0 auto" }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "12px" }}>
        <Timer className="w-5 h-5" style={{ width: "20px", height: "20px", color: isMyTurn ? "#00FFFF" : "#6b7280" }} />
        <span style={{ fontSize: "14px", fontWeight: 500, color: "#9ca3af" }}>Turn Timer</span>
      </div>

      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg style={{ width: "112px", height: "112px", transform: "rotate(-90deg)" }}>
          <circle cx="56" cy="56" r="45" stroke="#1a1a1a" strokeWidth="8" fill="none" />
          <motion.circle
            cx="56"
            cy="56"
            r="45"
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset }}
            style={{ strokeDasharray: circumference }}
            className={isFlashing && isMyTurn ? "animate-pulse" : ""}
          />
        </svg>
        <div style={{ position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "32px", fontWeight: "bold", fontFamily: "monospace", color }}>{CountupRenderer(secondsLeft)}</span>
        </div>
      </div>

      {isFlashing && isMyTurn && (
        <motion.p style={{ color: "#FF3131", fontSize: "12px", textAlign: "center", marginTop: "12px", fontWeight: 600 }} animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.5, repeat: Infinity }}>
          ⚡ Hurry up!
        </motion.p>
      )}
    </motion.div>
  );
}

function CountupRenderer(value: number) {
  return <CountUp end={value} start={value + 1} duration={0.5} useEasing={false} />;
}
