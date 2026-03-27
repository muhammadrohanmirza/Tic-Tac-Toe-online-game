"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, Circle } from "lucide-react";
import { CellValue } from "@/types/game";

interface GameCellProps {
  value: CellValue;
  index: number;
  onClick: () => void;
  disabled: boolean;
  isWinningCell?: boolean;
  isLastMove?: boolean;
  playerSymbol?: "X" | "O" | null;
}

export function GameCell({
  value,
  index,
  onClick,
  disabled,
  isWinningCell = false,
  isLastMove = false,
}: GameCellProps) {
  const isMyTurn = !disabled;

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || value !== null}
      style={{
        width: "80px",
        height: "80px",
        backgroundColor: value ? "#111111" : "rgba(17,17,17,0.8)",
        border: isWinningCell
          ? "2px solid #FFD700"
          : value
          ? "2px solid #333"
          : "2px solid #1a1a1a",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled || value ? "default" : isMyTurn ? "pointer" : "not-allowed",
        opacity: disabled && !value ? 0.5 : 1,
        transition: "all 0.3s ease",
        boxShadow: isWinningCell ? "0 0 20px #FFD700" : "none",
        animation: isWinningCell ? "winPulse 0.8s ease-in-out infinite" : "none",
      }}
      whileHover={isMyTurn && !value ? { scale: 1.05, borderColor: "#00FFFF44" } : {}}
      whileTap={isMyTurn && !value ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
    >
      {value === "X" && (
        <motion.div
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <X style={{ width: "48px", height: "48px", color: "#00FFFF" }} strokeWidth={3} />
        </motion.div>
      )}
      {value === "O" && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <Circle style={{ width: "48px", height: "48px", color: "#FF00FF" }} strokeWidth={3} />
        </motion.div>
      )}
      {isLastMove && !value && (
        <motion.div
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: "#666",
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
        />
      )}
    </motion.button>
  );
}
