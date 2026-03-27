"use client";

import React from "react";
import { NeonButton } from "@/components/ui/NeonButton";
import { NeonCard } from "@/components/ui/NeonCard";
import { Room } from "@/types/game";
import { motion } from "framer-motion";

interface RoomListProps {
  rooms: Room[];
  onJoinRoom: (roomId: string) => void;
  isLoading: boolean;
  onRefresh: () => void;
}

export function RoomList({
  rooms,
  onJoinRoom,
  isLoading,
  onRefresh,
}: RoomListProps) {
  return (
    <NeonCard variant="yellow" className="w-full" glow>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-neon-yellow neon-text-yellow">
          Public Rooms
        </h2>
        <NeonButton
          variant="yellow"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
        >
          🔄
        </NeonButton>
      </div>

      {rooms.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No public rooms available</p>
          <p className="text-gray-500 text-sm mt-2">
            Create a room or use Quick Match
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {rooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center justify-between p-3 bg-bg-card/50 rounded-lg border border-gray-800 hover:border-neon-yellow/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-neon-yellow font-bold">
                    {room.code}
                  </span>
                  <span className="text-gray-400 text-sm">
                    by {room.creatorName}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">
                    🟢 {room.playerX?.name || "Waiting"}
                  </span>
                  {room.playerO && (
                    <span className="text-xs text-gray-500">
                      vs {room.playerO.name}
                    </span>
                  )}
                </div>
              </div>
              <NeonButton
                variant="yellow"
                size="sm"
                onClick={() => onJoinRoom(room.id)}
                disabled={isLoading || !!room.playerO}
              >
                {room.playerO ? "Full" : "Join"}
              </NeonButton>
            </motion.div>
          ))}
        </div>
      )}

      <p className="text-gray-500 text-xs text-center mt-4">
        Auto-refreshes every 5 seconds
      </p>
    </NeonCard>
  );
}
