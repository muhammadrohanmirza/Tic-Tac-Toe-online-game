"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { UserAvatar } from "@/components/auth/UserAvatar";
import { NeonButton } from "@/components/ui/NeonButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import Confetti from "react-confetti";
import { LogOut, Trophy, X, Circle, Cpu, ArrowLeft } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { getBestMove, checkDraw } from "@/lib/aiPlayer";
import { useWindowSize } from "@/hooks/useWindowSize";

type CellValue = "X" | "O" | null;
type Difficulty = "easy" | "medium" | "hard";

interface Score {
  player: number;
  draw: number;
  computer: number;
}

function PlayAIContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isMobile, isTablet, isDesktop, width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState<"X" | "O">("X");
  const [gameStatus, setGameStatus] = useState<"waiting" | "playing" | "finished">("waiting");
  const [winner, setWinner] = useState<"X" | "O" | "draw" | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [isThinking, setIsThinking] = useState(false);
  const [score, setScore] = useState<Score>({ player: 0, draw: 0, computer: 0 });

  useEffect(() => {
    const diff = searchParams.get("difficulty") as Difficulty;
    if (diff && ["easy", "medium", "hard"].includes(diff)) {
      setDifficulty(diff);
    }
  }, [searchParams]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setGameStatus("playing");
      toast(`Game started! Difficulty: ${difficulty}`);
    }, 500);
    return () => clearTimeout(timer);
  }, [difficulty]);

  const checkWinner = useCallback((newBoard: CellValue[]): { winner: CellValue; line: number[] | null } => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        return { winner: newBoard[a], line: [a, b, c] };
      }
    }
    return { winner: null, line: null };
  }, []);

  const handleCellClick = useCallback((index: number) => {
    if (board[index] || gameStatus !== "playing" || currentTurn !== "X" || isThinking) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);

    const { winner: gameWinner, line } = checkWinner(newBoard);

    if (gameWinner) {
      setWinner(gameWinner);
      setWinningLine(line);
      setGameStatus("finished");
      if (gameWinner === "X") {
        setShowConfetti(true);
        toast.success("🎉 You Won!");
        setScore(prev => ({ ...prev, player: prev.player + 1 }));
        if (session?.user) {
          fetch("/api/scores", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ result: "win", opponent: `Computer (${difficulty})` }),
          }).catch(console.error);
        }
        setTimeout(() => setShowConfetti(false), 5000);
      }
      return;
    }

    if (checkDraw(newBoard)) {
      setWinner("draw");
      setGameStatus("finished");
      setScore(prev => ({ ...prev, draw: prev.draw + 1 }));
      toast("Draw!");
      return;
    }

    setCurrentTurn("O");
    setIsThinking(true);

    setTimeout(() => {
      const aiBoard = [...newBoard];
      const bestMove = getBestMove(aiBoard, difficulty);

      if (bestMove !== -1) {
        aiBoard[bestMove] = "O";
        setBoard(aiBoard);

        const { winner: aiWinner, line: aiLine } = checkWinner(aiBoard);

        if (aiWinner) {
          setWinner(aiWinner);
          setWinningLine(aiLine);
          setGameStatus("finished");
          setScore(prev => ({ ...prev, computer: prev.computer + 1 }));
          toast.error("🤖 Computer Wins!");
          return;
        }

        if (checkDraw(aiBoard)) {
          setWinner("draw");
          setGameStatus("finished");
          setScore(prev => ({ ...prev, draw: prev.draw + 1 }));
          toast("Draw!");
          return;
        }
      }

      setCurrentTurn("X");
      setIsThinking(false);
    }, 600 + Math.random() * 400);
  }, [board, gameStatus, currentTurn, isThinking, checkWinner, difficulty, session?.user]);

  const handlePlayAgain = () => {
    setBoard(Array(9).fill(null));
    setCurrentTurn("X");
    setGameStatus("playing");
    setWinner(null);
    setWinningLine(null);
    setIsThinking(false);
    toast("New game started!");
  };

  const handleLeaveRoom = () => {
    router.push("/lobby");
  };

  if (status === "loading") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#050505" }}>
        <LoadingSpinner variant="green" size="xl" text="Loading..." />
      </div>
    );
  }

  const isMyTurn = currentTurn === "X" && gameStatus === "playing";

  // Calculate responsive board size
  const getBoardSize = () => {
    if (isMobile) {
      return Math.min(width * 0.85, 340);
    } else if (isTablet) {
      return Math.min(width * 0.5, 400);
    }
    return 420;
  };

  const boardSize = getBoardSize();
  const cellSize = (boardSize - 16) / 3;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#050505", position: "relative", overflowX: "hidden" }}>
      <Toaster position="top-center" />
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={200} colors={["#00FFFF", "#00FF41", "#FFD700"]} gravity={0.3} />}

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
          gap: "12px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "8px" : "16px" }}>
            <ArrowLeft style={{
              width: isMobile ? "20px" : "24px",
              height: isMobile ? "20px" : "24px",
              color: "#00FF41",
              cursor: "pointer",
              flexShrink: 0,
            }} onClick={() => router.push("/lobby")} />
            <div>
              <h1 className="neon-text-green" style={{
                fontSize: isMobile ? "16px" : "20px",
                fontWeight: "bold",
                margin: 0,
              }}>VS COMPUTER</h1>
              <p style={{ color: "#6b7280", fontSize: isMobile ? "10px" : "12px", textTransform: "uppercase" }}>
                {difficulty} Mode
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "8px" : "16px" }}>
            {session?.user && <UserAvatar userName={session.user.name} userEmail={session.user.email} />}
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
      }}>

        {/* Score Board - Responsive */}
        <div style={{
          display: "flex",
          gap: isMobile ? "16px" : "24px",
          padding: isMobile ? "12px 16px" : "16px 32px",
          backgroundColor: "rgba(13,13,13,0.8)",
          borderRadius: "16px",
          border: "1px solid #1a1a1a",
          flexWrap: isMobile ? "wrap" : "nowrap",
          justifyContent: "center",
          width: "100%",
        }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#00FFFF", fontSize: isMobile ? "10px" : "12px", marginBottom: "4px" }}>YOU</p>
            <p className="neon-text-cyan" style={{ fontSize: isMobile ? "24px" : "32px", fontWeight: "bold", margin: 0 }}>{score.player}</p>
          </div>
          <div style={{ width: "1px", backgroundColor: "#333" }} />
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#666", fontSize: isMobile ? "10px" : "12px", marginBottom: "4px" }}>DRAW</p>
            <p style={{ color: "#FFD700", fontSize: isMobile ? "24px" : "32px", fontWeight: "bold", margin: 0 }}>{score.draw}</p>
          </div>
          <div style={{ width: "1px", backgroundColor: "#333" }} />
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#00FF41", fontSize: isMobile ? "10px" : "12px", marginBottom: "4px" }}>CPU</p>
            <p className="neon-text-green" style={{ fontSize: isMobile ? "24px" : "32px", fontWeight: "bold", margin: 0 }}>{score.computer}</p>
          </div>
        </div>

        {/* Players - Responsive */}
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
            name="COMPUTER 🤖"
            symbol="O"
            isActive={currentTurn === "O" && gameStatus === "playing"}
            isMobile={isMobile}
          />
        </div>

        {/* Game Status - Responsive */}
        {gameStatus === "waiting" && (
          <div style={{ textAlign: "center" }}>
            <LoadingSpinner variant="green" size="md" />
            <p className="neon-text-green" style={{
              marginTop: isMobile ? "12px" : "16px",
              fontSize: isMobile ? "16px" : "18px",
            }}>Starting game...</p>
          </div>
        )}

        {gameStatus === "playing" && (
          <div style={{
            textAlign: "center",
            padding: isMobile ? "12px 20px" : "16px 32px",
            backgroundColor: isMyTurn ? "rgba(0,255,65,0.1)" : "rgba(13,13,13,0.5)",
            borderRadius: "12px",
            border: `2px solid ${isMyTurn ? "#00FF41" : "#1a1a1a"}`,
            width: "100%",
            maxWidth: isMobile ? "100%" : "400px",
          }}>
            {isThinking ? (
              <motion.p className="neon-text-green" style={{
                fontSize: isMobile ? "16px" : "20px",
                fontWeight: "bold",
                margin: 0,
              }} animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                🤖 Thinking...
              </motion.p>
            ) : (
              <p className={isMyTurn ? "neon-text-green" : ""} style={{
                fontSize: isMobile ? "16px" : "20px",
                fontWeight: "bold",
                margin: 0,
              }}>
                {isMyTurn ? "⚡ Your Turn!" : "Computer's Turn..."}
              </p>
            )}
          </div>
        )}

        {gameStatus === "finished" && winner && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            style={{
              textAlign: "center",
              padding: isMobile ? "16px 20px" : "24px",
              backgroundColor: winner === "X" ? "rgba(0,255,65,0.1)" : winner === "draw" ? "rgba(255,215,0,0.1)" : "rgba(255,49,49,0.1)",
              borderRadius: "16px",
              border: `2px solid ${winner === "X" ? "#00FF41" : winner === "draw" ? "#FFD700" : "#FF3131"}`,
              width: "100%",
            }}
          >
            <p className={winner === "X" ? "neon-text-green" : winner === "draw" ? "neon-text-yellow" : "neon-text-red"}
              style={{
                fontSize: isMobile ? "clamp(20px, 6vw, 28px)" : "32px",
                fontWeight: "bold",
                margin: 0,
              }}>
              {winner === "X" ? "🎉 You Won!" : winner === "draw" ? "🤝 Draw!" : "🤖 Computer Wins!"}
            </p>
          </motion.div>
        )}

        {/* Board - Responsive */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: isMobile ? "6px" : "8px",
          padding: isMobile ? "16px" : "24px",
          backgroundColor: "rgba(13,13,13,0.8)",
          borderRadius: isMobile ? "16px" : "24px",
          border: "1px solid #1a1a1a",
          width: boardSize,
          opacity: isThinking ? 0.5 : 1,
          transition: "opacity 0.3s",
        }}>
          {board.map((cell, index) => (
            <motion.button
              key={index}
              onClick={() => handleCellClick(index)}
              disabled={cell !== null || !isMyTurn || gameStatus !== "playing" || isThinking}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: cell ? "#111" : "rgba(17,17,17,0.8)",
                border: winningLine?.includes(index) ? "2px solid #FFD700" : "2px solid #1a1a1a",
                borderRadius: isMobile ? "8px" : "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: cell || !isMyTurn || isThinking ? "default" : "pointer",
                transition: "all 0.3s",
                boxShadow: winningLine?.includes(index) ? "0 0 20px #FFD700" : "none",
              }}
              whileHover={isMyTurn && !cell && !isThinking ? { scale: 1.05, borderColor: "#00FF4144" } : {}}
              whileTap={isMyTurn && !cell && !isThinking ? { scale: 0.95 } : {}}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
            >
              {cell === "X" && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <X
                    style={{
                      width: cellSize * 0.55,
                      height: cellSize * 0.55,
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
                >
                  <Circle
                    style={{
                      width: cellSize * 0.55,
                      height: cellSize * 0.55,
                      color: "#00FF41",
                      strokeWidth: 3,
                    }}
                  />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Action Buttons - Responsive */}
        {gameStatus === "finished" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "flex",
              gap: isMobile ? "12px" : "16px",
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
              width: "100%",
            }}
          >
            <NeonButton
              variant="green"
              onClick={handlePlayAgain}
              size="lg"
              style={{
                width: isMobile ? "100%" : "auto",
                maxWidth: isMobile ? "300px" : "none",
                minHeight: isMobile ? "48px" : "auto",
              }}
            >
              Play Again
            </NeonButton>
            <NeonButton
              variant="default"
              onClick={handleLeaveRoom}
              size="lg"
              style={{
                width: isMobile ? "100%" : "auto",
                maxWidth: isMobile ? "300px" : "none",
                minHeight: isMobile ? "48px" : "auto",
              }}
            >
              Back to Lobby
            </NeonButton>
          </motion.div>
        )}

        {/* Difficulty Selector - Responsive */}
        <div style={{
          display: "flex",
          gap: isMobile ? "8px" : "12px",
          marginTop: isMobile ? "16px" : "24px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}>
          {(["easy", "medium", "hard"] as Difficulty[]).map((diff) => (
            <button
              key={diff}
              onClick={() => {
                setDifficulty(diff);
                router.push(`/play-ai?difficulty=${diff}`);
              }}
              style={{
                padding: isMobile ? "8px 14px" : "8px 16px",
                borderRadius: "8px",
                border: `2px solid ${difficulty === diff ? "#00FF41" : "#1a1a1a"}`,
                backgroundColor: difficulty === diff ? "rgba(0,255,65,0.1)" : "transparent",
                color: difficulty === diff ? "#00FF41" : "#666",
                fontWeight: difficulty === diff ? "bold" : "normal",
                cursor: "pointer",
                transition: "all 0.3s",
                textTransform: "uppercase",
                fontSize: isMobile ? "11px" : "12px",
                letterSpacing: "1px",
                minHeight: isMobile ? "44px" : "auto",
              }}
            >
              {diff}
            </button>
          ))}
        </div>
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
  symbol: "X" | "O";
  isActive: boolean;
  isYou?: boolean;
  isMobile: boolean;
}) {
  const color = symbol === "X" ? "#00FFFF" : "#00FF41";
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

export default function PlayAIPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#050505" }}>
        <LoadingSpinner variant="green" size="xl" text="Loading..." />
      </div>
    }>
      <PlayAIContent />
    </Suspense>
  );
}
