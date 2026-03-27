"use client";

import React, { useState } from "react";
import { NeonButton } from "@/components/ui/NeonButton";
import { NeonCard } from "@/components/ui/NeonCard";
import { motion } from "framer-motion";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface CreateRoomProps {
  onCreateRoom: (isPublic: boolean) => void;
  isLoading: boolean;
  roomCode?: string;
  isWaiting?: boolean;
}

export function CreateRoom({
  onCreateRoom,
  isLoading,
  roomCode,
  isWaiting,
}: CreateRoomProps) {
  const [isPublic, setIsPublic] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCreate = () => {
    onCreateRoom(isPublic);
  };

  const handleCopyCode = async () => {
    if (roomCode) {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <NeonCard variant="cyan" className="w-full" glow>
      <h2 className="text-xl font-bold text-neon-cyan neon-text-cyan mb-4">
        Create Room
      </h2>

      {!roomCode ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <label className="text-gray-300">Room Type</label>
            <div className="flex items-center gap-3">
              <span
                className={`text-sm ${
                  !isPublic ? "text-neon-cyan" : "text-gray-500"
                }`}
              >
                Private
              </span>
              <button
                onClick={() => setIsPublic(!isPublic)}
                className={`w-14 h-7 rounded-full transition-colors duration-300 ${
                  isPublic ? "bg-neon-cyan" : "bg-gray-600"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                    isPublic ? "translate-x-7" : "translate-x-0.5"
                  }`}
                />
              </button>
              <span
                className={`text-sm ${
                  isPublic ? "text-neon-cyan" : "text-gray-500"
                }`}
              >
                Public
              </span>
            </div>
          </div>

          <NeonButton
            variant="cyan"
            className="w-full"
            onClick={handleCreate}
            isLoading={isLoading}
          >
            {isLoading ? "Creating..." : "Create Room"}
          </NeonButton>
        </>
      ) : (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-gray-400 mb-2">Room Code</p>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="text-4xl font-bold text-neon-cyan neon-text-cyan tracking-wider">
              {roomCode}
            </div>
            <NeonButton
              variant="yellow"
              size="sm"
              onClick={handleCopyCode}
            >
              {copied ? "✓" : "📋"}
            </NeonButton>
          </div>
          {copied && (
            <p className="text-neon-green text-sm mb-3">Code copied!</p>
          )}
          {isWaiting ? (
            <div className="flex flex-col items-center gap-3">
              <LoadingSpinner variant="cyan" size="sm" />
              <p className="text-gray-400">Waiting for opponent...</p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">
              Share this code with your friend
            </p>
          )}
        </motion.div>
      )}
    </NeonCard>
  );
}
