"use client";

import React from "react";
import { motion } from "framer-motion";
import { NeonCard } from "@/components/ui/NeonCard";
import { LeaderboardEntry } from "@/types/game";
import CountUp from "react-countup";
import { Trophy, Medal, Award, Crown } from "lucide-react";

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
}

export function Leaderboard({ leaderboard, isLoading }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown style={{ width: "24px", height: "24px", color: "#FFD700" }} />;
    if (rank === 2) return <Medal style={{ width: "24px", height: "24px", color: "#9ca3af" }} />;
    if (rank === 3) return <Award style={{ width: "24px", height: "24px", color: "#b45309" }} />;
    return null;
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return { backgroundColor: "rgba(255,215,0,0.1)", borderColor: "#FFD700", boxShadow: "0 0 20px rgba(255,215,0,0.2)" };
    if (rank === 2) return { backgroundColor: "rgba(156,163,175,0.1)", borderColor: "#9ca3af" };
    if (rank === 3) return { backgroundColor: "rgba(180,83,9,0.1)", borderColor: "#b45309" };
    return { backgroundColor: "rgba(13,13,13,0.5)", borderColor: "#1a1a1a" };
  };

  if (isLoading) {
    return (
      <NeonCard variant="green" glow>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
          <Trophy style={{ width: "24px", height: "24px", color: "#00FF41" }} />
          <h2 className="neon-text-green" style={{ fontSize: "20px", fontWeight: "bold" }}>🏆 Leaderboard</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ height: "80px", backgroundColor: "rgba(13,13,13,0.5)", borderRadius: "12px", animation: "pulse 2s infinite" }} />
          ))}
        </div>
      </NeonCard>
    );
  }

  return (
    <NeonCard variant="green" glow>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
        <Trophy style={{ width: "24px", height: "24px", color: "#00FF41" }} />
        <h2 className="neon-text-green" style={{ fontSize: "20px", fontWeight: "bold" }}>🏆 Top Players</h2>
      </div>

      {leaderboard.length === 0 ? (
        <motion.div style={{ textAlign: "center", padding: "48px 24px" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Trophy style={{ width: "64px", height: "64px", color: "#374151", margin: "0 auto 16px" }} />
          <p style={{ color: "#9ca3af", marginBottom: "8px" }}>No games played yet</p>
          <p style={{ color: "#6b7280", fontSize: "14px" }}>Be the first to claim the top spot!</p>
        </motion.div>
      ) : (
        <motion.div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "384px", overflowY: "auto" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {leaderboard.map((entry, index) => (
            <motion.div
              key={entry.userId}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid",
                ...getRankStyle(entry.rank),
              }}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, x: 5 }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px" }}>
                {getRankIcon(entry.rank) || <span style={{ fontSize: "18px", fontWeight: "bold", color: "#9ca3af" }}>#{entry.rank}</span>}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{entry.userName}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>
                  <span>{entry.totalGames} games</span>
                  <span>•</span>
                  <span style={{ color: "#00FF41" }}>{entry.wins} wins</span>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <motion.p className="neon-text-green" style={{ fontSize: "24px", fontWeight: "bold" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <CountUp end={entry.winRate} duration={1.5} suffix="%" useEasing />
                </motion.p>
                <p style={{ fontSize: "12px", color: "#6b7280" }}>win rate</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </NeonCard>
  );
}
