"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TurnPlayer } from "@/types/game";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Sparkles, Frown, Meh } from "lucide-react";

interface GameStatusProps {
  gameStatus: "waiting" | "playing" | "finished";
  winner: TurnPlayer | "draw" | null;
  currentTurn: TurnPlayer;
  playerSymbol: TurnPlayer | null;
  isMyTurn: boolean;
}

export function GameStatus({ gameStatus, winner, currentTurn, playerSymbol, isMyTurn }: GameStatusProps) {
  if (gameStatus === "waiting") {
    return (
      <motion.div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "24px" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <LoadingSpinner variant="yellow" size="lg" />
        <motion.p className="neon-text-yellow" style={{ fontSize: "18px", fontWeight: 600 }} animate={{ opacity: [1, 0.7, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
          Waiting for opponent...
        </motion.p>
      </motion.div>
    );
  }

  if (gameStatus === "finished" && winner) {
    const isWin = winner === playerSymbol;
    const isDraw = winner === "draw";

    return (
      <AnimatePresence mode="wait">
        <motion.div
          style={{
            padding: "32px",
            borderRadius: "16px",
            border: "2px solid",
            borderColor: isWin ? "#00FF41" : isDraw ? "#FFD700" : "#FF3131",
            backgroundColor: isWin ? "rgba(0,255,65,0.1)" : isDraw ? "rgba(255,215,0,0.1)" : "rgba(255,49,49,0.1)",
            textAlign: "center",
            boxShadow: isWin ? "0 0 30px #00FF4133" : isDraw ? "0 0 30px #FFD70033" : "0 0 30px #FF313133",
          }}
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          {isWin && (
            <>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
                <Sparkles style={{ width: "64px", height: "64px", color: "#00FF41", margin: "0 auto 16px" }} />
              </motion.div>
              <motion.p className="neon-text-green" style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "8px" }} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                🎉 You Won!
              </motion.p>
              <motion.p style={{ color: "#9ca3af" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                Congratulations!
              </motion.p>
            </>
          )}
          {!isWin && !isDraw && (
            <>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
                <Frown style={{ width: "64px", height: "64px", color: "#FF3131", margin: "0 auto 16px" }} />
              </motion.div>
              <motion.p className="neon-text-red" style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "8px" }} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                😔 You Lost
              </motion.p>
              <motion.p style={{ color: "#9ca3af" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                Better luck next time!
              </motion.p>
            </>
          )}
          {isDraw && (
            <>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
                <Meh style={{ width: "64px", height: "64px", color: "#FFD700", margin: "0 auto 16px" }} />
              </motion.div>
              <motion.p className="neon-text-yellow" style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "8px" }} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                🤝 Draw!
              </motion.p>
              <motion.p style={{ color: "#9ca3af" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                It&apos;s a tie!
              </motion.p>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        style={{
          padding: "20px 32px",
          borderRadius: "12px",
          border: "2px solid",
          borderColor: isMyTurn ? "#00FFFF" : "#1a1a1a",
          backgroundColor: isMyTurn ? "rgba(0,255,255,0.1)" : "rgba(13,13,13,0.5)",
          textAlign: "center",
          boxShadow: isMyTurn ? "0 0 20px #00FFFF33" : "none",
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        {isMyTurn ? (
          <motion.p className="neon-text-cyan" style={{ fontSize: "20px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }} animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <Sparkles style={{ width: "20px", height: "20px" }} />
            Your Turn!
          </motion.p>
        ) : (
          <p style={{ color: "#9ca3af" }}>Opponent&apos;s Turn... ({currentTurn})</p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
