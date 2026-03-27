"use client";

import React from "react";
import { motion } from "framer-motion";
import { Player, TurnPlayer } from "@/types/game";
import { Circle, X, Wifi, WifiOff, Crown } from "lucide-react";

interface PlayerInfoProps {
  player: Player | null;
  symbol: TurnPlayer;
  isCurrentTurn: boolean;
  isYou?: boolean;
}

export function PlayerInfo({ player, symbol, isCurrentTurn, isYou = false }: PlayerInfoProps) {
  const color = symbol === "X" ? "#00FFFF" : "#FF00FF";

  return (
    <motion.div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "16px",
        borderRadius: "12px",
        border: `2px solid ${isCurrentTurn ? color : "#1a1a1a"}`,
        backgroundColor: "rgba(13,13,13,0.8)",
        backdropFilter: "blur(10px)",
        boxShadow: isCurrentTurn ? `0 0 20px ${color}33` : "none",
        animation: isCurrentTurn ? "borderPulse 1.5s ease-in-out infinite" : "none",
      }}
      initial={{ opacity: 0, x: isYou ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "9999px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "32px",
          fontWeight: "bold",
          border: `2px solid ${color}`,
          backgroundColor: `${color}22`,
          color,
        }}
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        {symbol === "X" ? <X style={{ width: "32px", height: "32px" }} strokeWidth={3} /> : <Circle style={{ width: "32px", height: "32px" }} strokeWidth={3} />}
      </motion.div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {isYou && <Crown style={{ width: "16px", height: "16px", color: "#FFD700" }} />}
          <span style={{ fontWeight: "bold", color, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{player?.name || "Waiting..."}</span>
          {player && (player.isOnline ? <Wifi style={{ width: "16px", height: "16px", color: "#00FF41" }} /> : <WifiOff style={{ width: "16px", height: "16px", color: "#FF3131" }} />)}
        </div>
        {isYou && <span style={{ fontSize: "12px", color: "#9ca3af" }}>You ({symbol})</span>}
        {!player && <span style={{ fontSize: "12px", color: "#6b7280" }}>Waiting for player...</span>}
        {player && !isYou && <span style={{ fontSize: "12px", color: "#6b7280" }}>Opponent ({symbol})</span>}
      </div>

      {isCurrentTurn && <motion.div style={{ width: "12px", height: "12px", borderRadius: "9999px", backgroundColor: color }} animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }} transition={{ duration: 1, repeat: Infinity }} />}
    </motion.div>
  );
}
