"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeonButton } from "@/components/ui/NeonButton";
import { RefreshCw, Check, Hourglass } from "lucide-react";

interface RematchButtonProps {
  onRequestRematch: () => void;
  onAcceptRematch: () => void;
  hasRequestedRematch: boolean;
  opponentRequestedRematch: boolean;
  gameStatus: "waiting" | "playing" | "finished";
  disabled?: boolean;
}

export function RematchButton({ onRequestRematch, onAcceptRematch, hasRequestedRematch, opponentRequestedRematch, gameStatus, disabled = false }: RematchButtonProps) {
  const [isAccepting, setIsAccepting] = useState(false);

  const handleAccept = () => {
    setIsAccepting(true);
    onAcceptRematch();
    setTimeout(() => setIsAccepting(false), 1000);
  };

  if (gameStatus !== "finished") return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
        {opponentRequestedRematch && !hasRequestedRematch ? (
          <motion.div style={{ textAlign: "center" }} initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <motion.p className="neon-text-yellow" style={{ marginBottom: "16px", fontWeight: 600 }} animate={{ opacity: [1, 0.7, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
              Opponent wants a rematch!
            </motion.p>
            <NeonButton variant="green" onClick={handleAccept} isLoading={isAccepting} size="lg">
              <Check style={{ width: "20px", height: "20px" }} />
              Accept Rematch
            </NeonButton>
          </motion.div>
        ) : hasRequestedRematch ? (
          <motion.div style={{ textAlign: "center" }} initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "8px" }} className="neon-text-cyan">
              <Hourglass style={{ width: "20px", height: "20px" }} />
              <span style={{ fontWeight: 600 }}>Waiting for opponent...</span>
            </div>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>Rematch request sent</p>
          </motion.div>
        ) : (
          <NeonButton variant="yellow" onClick={onRequestRematch} disabled={disabled} size="lg">
            <RefreshCw style={{ width: "20px", height: "20px" }} />
            Request Rematch
          </NeonButton>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
