"use client";

import React, { useState } from "react";
import { NeonButton } from "@/components/ui/NeonButton";
import { NeonCard } from "@/components/ui/NeonCard";
import { NeonInput } from "@/components/ui/NeonInput";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface JoinRoomProps {
  onJoinRoom: (roomCode: string) => void;
  onQuickMatch: () => void;
  isLoading: boolean;
  error?: string | null;
}

export function JoinRoom({
  onJoinRoom,
  onQuickMatch,
  isLoading,
  error,
}: JoinRoomProps) {
  const [roomCode, setRoomCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.trim().length >= 4) {
      onJoinRoom(roomCode.trim().toUpperCase());
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (value.length <= 4) {
      setRoomCode(value);
    }
  };

  return (
    <NeonCard variant="pink" className="w-full" glow>
      <h2 className="text-xl font-bold text-neon-pink neon-text-pink mb-4">
        Join Room
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <NeonInput
          label="Room Code"
          placeholder="ABCD"
          value={roomCode}
          onChange={handleCodeChange}
          variant="pink"
          maxLength={4}
          className="text-center text-2xl tracking-widest uppercase"
        />

        {error && (
          <div className="p-3 bg-neon-red/10 border border-neon-red rounded-lg text-neon-red text-sm text-center">
            {error}
          </div>
        )}

        <NeonButton
          type="submit"
          variant="pink"
          className="w-full"
          isLoading={isLoading}
          disabled={roomCode.length < 4}
        >
          {isLoading ? "Joining..." : "Join Room"}
        </NeonButton>
      </form>

      <div className="my-4 flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-700" />
        <span className="text-gray-500 text-sm">OR</span>
        <div className="flex-1 h-px bg-gray-700" />
      </div>

      <NeonButton
        variant="green"
        className="w-full"
        onClick={onQuickMatch}
        isLoading={isLoading}
      >
        ⚡ Quick Match
      </NeonButton>

      <p className="text-gray-500 text-xs text-center mt-3">
        Find a random opponent instantly
      </p>
    </NeonCard>
  );
}
