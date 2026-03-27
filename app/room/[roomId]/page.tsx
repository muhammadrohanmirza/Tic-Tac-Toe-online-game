"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { UserAvatar } from "@/components/auth/UserAvatar";
import { NeonButton } from "@/components/ui/NeonButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import Confetti from "react-confetti";
import { LogOut, Trophy, X, Circle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { getSocket } from "@/lib/socket-client";
import { useWindowSize } from "@/hooks/useWindowSize";

type CellValue = "X" | "O" | null;
type TurnPlayer = "X" | "O";

export default function GameRoomPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const roomId = params?.roomId as string;
  const { isMobile, isTablet, isDesktop, width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState<TurnPlayer>("X");
  const [gameStatus, setGameStatus] = useState<"waiting" | "playing" | "finished">("waiting");
  const [winner, setWinner] = useState<TurnPlayer | "draw" | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [playerSymbol, setPlayerSymbol] = useState<TurnPlayer | null>("X");
  const [opponentName, setOpponentName] = useState("Waiting...");
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [rematchRequested, setRematchRequested] = useState(false);
  const [rematchAccepted, setRematchAccepted] = useState(false);

  const socket = getSocket();

  // Calculate responsive board size - ensure it fits within container
  const getBoardSize = () => {
    if (isMobile) {
      // Mobile: max 320px to fit within screen with padding
      return Math.min(width - 40, 320);
    } else if (isTablet) {
      // Tablet: 45% of viewport width, max 380px
      return Math.min(width * 0.45, 380);
    }
    // Desktop: fixed 360px to fit comfortably
    return 360;
  };

  const boardSize = getBoardSize();
  const cellGap = isMobile ? 6 : 8;
  const boardPadding = isMobile ? 16 : 24;
  const cellSize = (boardSize - (boardPadding * 2) - (cellGap * 2)) / 3;

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (!roomId || roomId === "undefined") {
      console.error("[Room] Invalid roomId:", roomId);
      toast.error("Invalid room");
      router.push("/lobby");
      return;
    }

    if (!session?.user) return;

    sessionStorage.setItem(`joined-room-${roomId}`, "true");
    console.log("[Room] Requesting room data:", roomId);
    socket?.emit("get-room", { roomId, userId: session.user.id });

    return () => {
      // Cleanup
    };
  }, [roomId, session, router, socket]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("room-joined", (data: any) => {
      console.log("[Room] room-joined:", data);
      const room = data?.room || data;
      if (room) {
        const normalizedBoard = (room.board || []).map((cell: string) => cell === "" ? null : cell as CellValue);
        setBoard(normalizedBoard);
        setCurrentTurn(room.currentTurn || "X");
        setGameStatus(room.status || "playing");
        if (room.player1?.id === session?.user?.id) {
          setPlayerSymbol("X");
          setOpponentName(room.player2?.name || "Opponent");
        } else if (room.player2?.id === session?.user?.id) {
          setPlayerSymbol("O");
          setOpponentName(room.player1?.name || "Opponent");
        }
      }
    });

    socket.on("room-data", (data: any) => {
      console.log("[Room] room-data:", data);
      const room = data?.room;
      if (!room) {
        console.error("[Room] Room data is empty");
        toast.error("Room not found");
        router.push("/lobby");
        return;
      }
      const normalizedBoard = (room.board || []).map((cell: string) => cell === "" ? null : cell as CellValue);
      setBoard(normalizedBoard);
      setCurrentTurn(room.currentTurn || "X");
      setGameStatus(room.status || "playing");

      const isPlayer1 = room.player1?.id === session?.user?.id;
      const isPlayer2 = room.player2?.id === session?.user?.id;

      if (isPlayer1) {
        setPlayerSymbol("X");
        setOpponentName(room.player2?.name || "Waiting...");
      } else if (isPlayer2) {
        setPlayerSymbol("O");
        setOpponentName(room.player1?.name || "Waiting...");
      }
    });

    socket.on("player-joined", (data: any) => {
      console.log("[Room] player-joined:", data);
      toast.success("Opponent joined!");
      setGameStatus("playing");
      if (data.player) {
        setOpponentName(data.player.name);
      }
      const room = data?.room;
      if (room) {
        const normalizedBoard = (room.board || []).map((cell: string) => cell === "" ? null : cell as CellValue);
        setBoard(normalizedBoard);
        setCurrentTurn(room.currentTurn || "X");
      }
    });

    socket.on("board-updated", (data: any) => {
      console.log("[Room] board-updated:", data);
      const normalizedBoard = (data.board || []).map((cell: string) => cell === "" ? null : cell as CellValue);
      setBoard(normalizedBoard);
      setCurrentTurn(data.currentTurn || "X");
      if (data.winner) {
        setWinner(data.winner);
        setGameStatus("finished");
      }
      if (data.winningLine) {
        setWinningLine(data.winningLine);
      }
    });

    socket.on("game-over", (data: any) => {
      console.log("[Room] game-over:", data);
      setWinner(data.winner);
      setWinningLine(data.winningLine);
      setGameStatus("finished");
      if (data.winner === playerSymbol) {
        setShowConfetti(true);
        toast.success("🎉 You Won!");
        setTimeout(() => setShowConfetti(false), 5000);
        if (session?.user) {
          fetch("/api/scores", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ result: "win", opponent: opponentName }),
          }).catch(console.error);
        }
      } else if (data.winner === "draw") {
        toast("Draw!");
      } else {
        toast.error("You Lost");
      }
    });

    socket.on("opponent-left", (data: any) => {
      console.log("[Room] opponent-left:", data);
      toast.error("Opponent left!");
      setGameStatus("finished");
    });

    socket.on("rematch-started", (data: any) => {
      console.log("[Room] rematch-started:", data);
      const room = data?.room;
      if (room) {
        setBoard(Array(9).fill(null));
        setCurrentTurn("X");
        setGameStatus("playing");
        setWinner(null);
        setWinningLine(null);
        setRematchRequested(false);
        setRematchAccepted(false);
        toast("Rematch started!");
      }
    });

    socket.on("rematch-requested", (data: any) => {
      console.log("[Room] rematch-requested:", data);
      setRematchRequested(true);
      toast("Opponent wants a rematch!");
    });

    socket.on("rematch-rejected", (data: any) => {
      console.log("[Room] rematch-rejected:", data);
      setRematchRequested(false);
      toast.error("Opponent declined rematch");
      setTimeout(() => router.push("/lobby"), 1500);
    });

    socket.on("error", (data: any) => {
      console.error("[Room] error:", data);
      toast.error(data.message);
      if (data.message === "Room not found") {
        setTimeout(() => router.push("/lobby"), 1500);
      }
    });

    return () => {
      socket.off("room-joined");
      socket.off("room-data");
      socket.off("player-joined");
      socket.off("board-updated");
      socket.off("game-over");
      socket.off("opponent-left");
      socket.off("rematch-started");
      socket.off("rematch-requested");
      socket.off("rematch-rejected");
      socket.off("error");
    };
  }, [socket, playerSymbol, opponentName, session?.user, router]);

  useEffect(() => {
    setIsMyTurn(currentTurn === playerSymbol && gameStatus === "playing");
  }, [currentTurn, playerSymbol, gameStatus]);

  const handleLeaveRoom = () => {
    if (roomId) {
      socket?.emit("leave-room", { roomId });
      sessionStorage.removeItem(`joined-room-${roomId}`);
    }
    router.push("/lobby");
  };

  const handleRematch = () => {
    if (roomId && session?.user) {
      socket?.emit("request-rematch", { roomId, playerId: session.user.id });
      setRematchAccepted(true);
      toast("Rematch requested! Waiting for opponent...");
    }
  };

  const handleAcceptRematch = () => {
    if (roomId && session?.user) {
      socket?.emit("accept-rematch", { roomId, playerId: session.user.id });
      setRematchRequested(false);
      setRematchAccepted(false);
    }
  };

  const handleRejectRematch = () => {
    if (roomId) {
      socket?.emit("reject-rematch", { roomId });
      setRematchRequested(false);
      setTimeout(() => router.push("/lobby"), 500);
    }
  };

  if (status === "loading") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#050505" }}>
        <LoadingSpinner variant="cyan" size="xl" text="Loading game..." />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#050505", position: "relative", overflowX: "hidden" }}>
      <Toaster position="top-center" />
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={200} colors={["#00FFFF", "#FF00FF", "#00FF41", "#FFD700"]} gravity={0.3} />}

      {/* Header - Responsive */}
      <header style={{
        padding: isMobile ? "10px 16px" : "16px",
        borderBottom: "1px solid #1a1a1a",
        backgroundColor: "rgba(13,13,13,0.8)",
      }}>
        <div style={{
          maxWidth: "1120px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Trophy style={{
              width: isMobile ? "18px" : "24px",
              height: isMobile ? "18px" : "24px",
              color: "#00FFFF",
            }} />
            <h1 className="neon-text-cyan" style={{
              fontSize: isMobile ? "16px" : "20px",
              fontWeight: "bold",
              margin: 0,
            }}>Game Room</h1>
          </div>
          <NeonButton
            variant="red"
            size={isMobile ? "sm" : "md"}
            onClick={handleLeaveRoom}
            style={{
              padding: isMobile ? "6px 12px" : "8px 16px",
              fontSize: isMobile ? "12px" : "14px",
              minHeight: isMobile ? "40px" : "auto",
            }}
          >
            <LogOut style={{ width: isMobile ? "14px" : "16px", height: isMobile ? "14px" : "16px" }} />
            <span style={{ display: isMobile ? "none" : "inline" }}>Leave</span>
          </NeonButton>
        </div>
      </header>

      {/* Main Content - Responsive */}
      <main style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: isMobile ? "16px" : "40px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: isMobile ? "20px" : "32px",
        overflowX: "hidden",
      }}>

        {/* Players - Responsive: Side by side on all screens but smaller on mobile */}
        <div style={{
          display: "flex",
          gap: isMobile ? "12px" : "24px",
          width: "100%",
          justifyContent: "center",
          flexWrap: isMobile ? "wrap" : "nowrap",
        }}>
          <PlayerCard
            name={session?.user?.name || "You"}
            symbol="X"
            isActive={currentTurn === "X" && gameStatus === "playing"}
            isYou
            isMobile={isMobile}
          />
          <PlayerCard
            name={opponentName}
            symbol="O"
            isActive={currentTurn === "O" && gameStatus === "playing"}
            isMobile={isMobile}
          />
        </div>

        {/* Game Status - Responsive */}
        {gameStatus === "waiting" && (
          <div style={{ textAlign: "center" }}>
            <LoadingSpinner variant="yellow" size="md" />
            <p className="neon-text-yellow" style={{
              marginTop: isMobile ? "12px" : "16px",
              fontSize: isMobile ? "16px" : "18px",
            }}>Waiting for opponent...</p>
          </div>
        )}

        {gameStatus === "playing" && (
          <div style={{
            textAlign: "center",
            padding: isMobile ? "12px 20px" : "16px 32px",
            backgroundColor: isMyTurn ? "rgba(0,255,255,0.1)" : "rgba(13,13,13,0.5)",
            borderRadius: "12px",
            border: `2px solid ${isMyTurn ? "#00FFFF" : "#1a1a1a"}`,
            width: "100%",
            maxWidth: isMobile ? "100%" : "400px",
          }}>
            <p className={isMyTurn ? "neon-text-cyan" : ""} style={{
              fontSize: isMobile ? "16px" : "20px",
              fontWeight: "bold",
              margin: 0,
            }}>
              {isMyTurn ? "⚡ Your Turn!" : "Opponent's Turn..."}
            </p>
          </div>
        )}

        {gameStatus === "finished" && winner && (
          <div style={{
            textAlign: "center",
            padding: isMobile ? "16px 20px" : "24px",
            backgroundColor: winner === playerSymbol ? "rgba(0,255,65,0.1)" : winner === "draw" ? "rgba(255,215,0,0.1)" : "rgba(255,49,49,0.1)",
            borderRadius: "16px",
            border: `2px solid ${winner === playerSymbol ? "#00FF41" : winner === "draw" ? "#FFD700" : "#FF3131"}`,
            width: "100%",
          }}>
            <p className={winner === playerSymbol ? "neon-text-green" : winner === "draw" ? "neon-text-yellow" : "neon-text-red"}
              style={{
                fontSize: isMobile ? "clamp(20px, 6vw, 28px)" : "32px",
                fontWeight: "bold",
                margin: 0,
              }}>
              {winner === playerSymbol ? "🎉 You Won!" : winner === "draw" ? "🤝 Draw!" : "😔 You Lost"}
            </p>
          </div>
        )}

        {/* Game Board - Responsive */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: cellGap,
          padding: boardPadding,
          backgroundColor: "rgba(13,13,13,0.8)",
          borderRadius: isMobile ? "16px" : "24px",
          border: "1px solid #1a1a1a",
          width: boardSize,
          maxWidth: "100%",
          boxSizing: "border-box",
        }}>
          {board.map((cell, index) => (
            <motion.button
              key={index}
              onClick={() => {
                if (isMyTurn && cell === null && socket) {
                  socket.emit("make-move", {
                    roomId,
                    cellIndex: index,
                    playerId: session?.user?.id,
                  });
                }
              }}
              disabled={cell !== null || !isMyTurn || gameStatus !== "playing"}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: cell ? "#111" : "rgba(17,17,17,0.8)",
                border: winningLine?.includes(index) ? "2px solid #FFD700" : "2px solid #1a1a1a",
                borderRadius: isMobile ? "8px" : "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: cell || !isMyTurn || gameStatus !== "playing" ? "default" : "pointer",
                transition: "all 0.3s",
                boxShadow: winningLine?.includes(index) ? "0 0 20px #FFD700" : "none",
                overflow: "hidden",
              }}
              whileHover={isMyTurn && !cell && gameStatus === "playing" ? { scale: 1.05, borderColor: "#00FFFF44" } : {}}
              whileTap={isMyTurn && !cell && gameStatus === "playing" ? { scale: 0.95 } : {}}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
            >
              {cell === "X" && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  style={{ width: cellSize * 0.6, height: cellSize * 0.6 }}
                >
                  <X
                    style={{
                      width: "100%",
                      height: "100%",
                      color: "#00FFFF",
                      strokeWidth: 3,
                    }}
                  />
                </motion.div>
              )}
              {cell === "O" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  style={{ width: cellSize * 0.6, height: cellSize * 0.6 }}
                >
                  <Circle
                    style={{
                      width: "100%",
                      height: "100%",
                      color: "#FF00FF",
                      strokeWidth: 3,
                    }}
                  />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Rematch Section - Responsive */}
        {gameStatus === "finished" && (
          <div style={{
            display: "flex",
            gap: isMobile ? "12px" : "16px",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}>
            {!rematchRequested ? (
              <>
                <NeonButton
                  variant="yellow"
                  onClick={handleRematch}
                  disabled={rematchAccepted}
                  style={{
                    width: isMobile ? "100%" : "auto",
                    maxWidth: isMobile ? "300px" : "none",
                    minHeight: isMobile ? "48px" : "auto",
                  }}
                >
                  {rematchAccepted ? "Waiting for Opponent..." : "Play Again"}
                </NeonButton>
                <NeonButton
                  variant="default"
                  onClick={handleLeaveRoom}
                  style={{
                    width: isMobile ? "100%" : "auto",
                    maxWidth: isMobile ? "300px" : "none",
                    minHeight: isMobile ? "48px" : "auto",
                  }}
                >
                  Back to Lobby
                </NeonButton>
              </>
            ) : (
              <>
                <p className="neon-text-yellow" style={{
                  fontSize: isMobile ? "16px" : "18px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                  textAlign: "center",
                }}>
                  Opponent wants a rematch!
                </p>
                <div style={{ display: "flex", gap: isMobile ? "12px" : "16px" }}>
                  <NeonButton
                    variant="green"
                    onClick={handleAcceptRematch}
                    style={{ minHeight: isMobile ? "48px" : "auto" }}
                  >
                    Accept
                  </NeonButton>
                  <NeonButton
                    variant="red"
                    onClick={handleRejectRematch}
                    style={{ minHeight: isMobile ? "48px" : "auto" }}
                  >
                    Reject
                  </NeonButton>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// Player Card Component - Responsive
function PlayerCard({
  name,
  symbol,
  isActive,
  isYou,
  isMobile,
}: {
  name: string;
  symbol: TurnPlayer;
  isActive: boolean;
  isYou?: boolean;
  isMobile: boolean;
}) {
  const color = symbol === "X" ? "#00FFFF" : "#FF00FF";
  const Icon = symbol === "X" ? X : Circle;

  return (
    <motion.div
      style={{
        display: "flex",
        alignItems: "center",
        gap: isMobile ? "10px" : "16px",
        padding: isMobile ? "12px" : "16px",
        borderRadius: "12px",
        border: `2px solid ${isActive ? color : "#1a1a1a"}`,
        backgroundColor: "rgba(13,13,13,0.8)",
        boxShadow: isActive ? `0 0 20px ${color}33` : "none",
        minWidth: isMobile ? "140px" : "200px",
        flex: isMobile ? 1 : "none",
        maxWidth: isMobile ? "180px" : "none",
      }}
      animate={isActive ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <div style={{
        width: isMobile ? "40px" : "56px",
        height: isMobile ? "40px" : "56px",
        borderRadius: "50%",
        border: `2px solid ${color}`,
        backgroundColor: `${color}22`,
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        <Icon style={{
          width: isMobile ? "24px" : "32px",
          height: isMobile ? "24px" : "32px",
        }} strokeWidth={3} />
      </div>
      <div style={{ overflow: "hidden" }}>
        <p style={{
          fontWeight: "bold",
          color,
          margin: 0,
          fontSize: isMobile ? "12px" : "14px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          {name}
        </p>
        {isYou && (
          <p style={{
            fontSize: isMobile ? "10px" : "12px",
            color: "#9ca3af",
            margin: 0,
          }}>
            You ({symbol})
          </p>
        )}
      </div>
      {isActive && (
        <motion.div
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: color,
            flexShrink: 0,
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
