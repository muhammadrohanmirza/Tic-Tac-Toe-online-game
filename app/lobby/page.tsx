"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserAvatar } from "@/components/auth/UserAvatar";
import { NeonButton } from "@/components/ui/NeonButton";
import { NeonCard } from "@/components/ui/NeonCard";
import { NeonInput } from "@/components/ui/NeonInput";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Leaderboard } from "@/components/leaderboard/Leaderboard";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Copy, Check, Users, Cpu, Menu, X as XIcon, LogOut } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import * as Switch from "@radix-ui/react-switch";
import { getSocket } from "@/lib/socket-client";
import { useWindowSize } from "@/hooks/useWindowSize";

type GameMode = "multiplayer" | "ai";
type Difficulty = "easy" | "medium" | "hard";

export default function LobbyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isMobile, isTablet, isDesktop } = useWindowSize();
  const [gameMode, setGameMode] = useState<GameMode>("multiplayer");
  const [isPublic, setIsPublic] = useState(true);
  const [roomCode, setRoomCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);
  const [createdRoom, setCreatedRoom] = useState<{ code: string; id: string } | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const socket = getSocket();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/scores?game=tictactoe");
        const data = await res.json();
        if (data.success) setLeaderboard(data.leaderboard);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      } finally {
        setIsLoadingLeaderboard(false);
      }
    };
    fetchLeaderboard();
  }, []);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("room-created", (data: any) => {
      console.log("[Lobby] room-created:", data);
      const code = data?.roomCode || data?.room?.code;
      const id = data?.roomId || data?.room?.id;
      if (code) setRoomCode(code);
      if (id) setCreatedRoom({ code, id });
      setIsCreating(false);
      toast.success("Room created! Share the code.");
    });

    socket.on("room-joined", (data: any) => {
      console.log("[Lobby] room-joined:", data);
      const id = data?.roomId || data?.room?.id;
      if (id) {
        toast.success("Joined room!");
        router.push(`/room/${id}`);
      } else {
        console.error("[Lobby] roomId undefined!", data);
        setJoinError("Failed to join room");
        setIsJoining(false);
      }
    });

    socket.on("player-joined", (data: any) => {
      console.log("[Lobby] player-joined:", data);
      const id = data?.roomId || data?.room?.id;
      if (id) {
        toast.success("Opponent joined!");
        router.push(`/room/${id}`);
      }
    });

    socket.on("error", (data) => {
      console.error("[Lobby] error:", data);
      setJoinError(data.message);
      toast.error(data.message);
      setIsJoining(false);
      setIsCreating(false);
    });

    return () => {
      socket.off("room-created");
      socket.off("room-joined");
      socket.off("player-joined");
      socket.off("error");
    };
  }, [socket, router]);

  const handleCreateRoom = () => {
    if (!session?.user) {
      toast.error("Please log in");
      return;
    }
    setIsCreating(true);
    setJoinError(null);
    socket?.emit("create-room", {
      userId: session.user.id,
      userName: session.user.name || "Player",
      isPublic,
    });
  };

  const handleJoinRoom = () => {
    if (!session?.user) {
      toast.error("Please log in");
      return;
    }
    if (roomCode.length < 4) {
      setJoinError("Enter a valid 4-character code");
      return;
    }
    setIsJoining(true);
    setJoinError(null);
    socket?.emit("join-room", {
      roomId: roomCode.toUpperCase().trim(),
      userId: session.user.id,
      userName: session.user.name || "Player",
    });
  };

  const handlePlayAI = () => {
    router.push(`/play-ai?difficulty=${difficulty}`);
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    router.push("/");
  };

  const handleCopyCode = async () => {
    if (createdRoom) {
      await navigator.clipboard.writeText(createdRoom.code);
      setCopied(true);
      toast.success("Code copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (value.length <= 4) setRoomCode(value);
  };

  if (status === "loading") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#050505" }}>
        <LoadingSpinner variant="cyan" size="xl" text="Loading..." />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#050505", position: "relative" }}>
      <Toaster position="top-right" />

      {/* Header - Horizontal on Desktop/Tablet, Menu on Mobile */}
      <header style={{
        padding: isMobile ? "10px 16px" : "16px",
        borderBottom: "1px solid #1a1a1a",
        backgroundColor: "rgba(13,13,13,0.95)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{
          maxWidth: "1120px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Users style={{
              width: isMobile ? "20px" : "24px",
              height: isMobile ? "20px" : "24px",
              color: "#00FFFF",
              flexShrink: 0,
            }} />
            <h1 className="neon-text-cyan" style={{
              fontSize: isMobile ? "16px" : "18px",
              fontWeight: "bold",
              margin: 0,
              whiteSpace: "nowrap",
            }}>Game Lobby</h1>
          </div>

          {/* Desktop/Tablet: Horizontal UserAvatar + Logout Button */}
          {!isMobile ? (
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {session?.user && <UserAvatar userName={session.user.name} userEmail={session.user.email} />}
              <NeonButton
                variant="red"
                size="sm"
                onClick={handleLogout}
                style={{
                  padding: "8px 16px",
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                }}
              >
                <LogOut style={{ width: "16px", height: "16px" }} />
                Logout
              </NeonButton>
            </div>
          ) : (
            /* Mobile: Hamburger Menu */
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                background: "transparent",
                border: "1px solid #00FFFF",
                borderRadius: "8px",
                padding: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "44px",
                minWidth: "44px",
              }}
            >
              {isMenuOpen ? (
                <XIcon style={{ width: "24px", height: "24px", color: "#00FFFF" }} />
              ) : (
                <Menu style={{ width: "24px", height: "24px", color: "#00FFFF" }} />
              )}
            </button>
          )}
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMenuOpen && isMobile && session?.user && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                marginTop: "16px",
                padding: "16px",
                backgroundColor: "rgba(13,13,13,0.95)",
                borderRadius: "12px",
                border: "1px solid #1a1a1a",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {/* User Info */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                backgroundColor: "rgba(0,255,255,0.05)",
                borderRadius: "8px",
              }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #00FFFF, #FF00FF)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  color: "#050505",
                  fontSize: "18px",
                  flexShrink: 0,
                }}>
                  {session.user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div style={{ overflow: "hidden" }}>
                  <p style={{
                    fontWeight: "bold",
                    color: "#ffffff",
                    margin: 0,
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                    {session.user.name}
                  </p>
                  <p style={{
                    fontSize: "12px",
                    color: "#9ca3af",
                    margin: "4px 0 0",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                    {session.user.email}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <NeonButton
                variant="red"
                onClick={handleLogout}
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: "14px",
                  minHeight: "48px",
                  justifyContent: "center",
                }}
              >
                <LogOut style={{ width: "18px", height: "18px" }} />
                Logout
              </NeonButton>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content - Responsive */}
      <main style={{
        maxWidth: "1120px",
        margin: "0 auto",
        padding: isMobile ? "16px" : "24px 16px",
      }}>

        {/* Game Mode Toggle - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: isMobile ? "16px" : "24px",
            padding: "6px",
            backgroundColor: "#111",
            borderRadius: "50px",
            maxWidth: "400px",
            margin: "0 auto 16px",
          }}
        >
          <button
            onClick={() => setGameMode("multiplayer")}
            style={{
              flex: 1,
              padding: isMobile ? "8px 12px" : "10px 16px",
              borderRadius: "50px",
              border: "none",
              cursor: "pointer",
              fontWeight: gameMode === "multiplayer" ? "bold" : "normal",
              backgroundColor: gameMode === "multiplayer" ? "#00FFFF" : "transparent",
              color: gameMode === "multiplayer" ? "#000" : "#666",
              transition: "all 0.3s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              fontSize: isMobile ? "12px" : "14px",
              minWidth: 0,
            }}
          >
            <Users style={{
              width: isMobile ? "14px" : "18px",
              height: isMobile ? "14px" : "18px",
              flexShrink: 0,
            }} />
            <span style={{ whiteSpace: "nowrap" }}>Multiplayer</span>
          </button>
          <button
            onClick={() => setGameMode("ai")}
            style={{
              flex: 1,
              padding: isMobile ? "8px 12px" : "10px 16px",
              borderRadius: "50px",
              border: "none",
              cursor: "pointer",
              fontWeight: gameMode === "ai" ? "bold" : "normal",
              backgroundColor: gameMode === "ai" ? "#00FF41" : "transparent",
              color: gameMode === "ai" ? "#000" : "#666",
              transition: "all 0.3s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              fontSize: isMobile ? "12px" : "14px",
              minWidth: 0,
            }}
          >
            <Cpu style={{
              width: isMobile ? "14px" : "18px",
              height: isMobile ? "14px" : "18px",
              flexShrink: 0,
            }} />
            <span style={{ whiteSpace: "nowrap" }}>Human vs Computer</span>
          </button>
        </motion.div>

        <AnimatePresence mode="wait">
          {gameMode === "multiplayer" ? (
            <motion.div
              key="multiplayer"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: isMobile ? "12px" : "16px",
                marginBottom: isMobile ? "20px" : "24px",
              }}>

                {/* Create Room */}
                <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }}>
                  <NeonCard variant="cyan" style={{ height: "100%" }} glow>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: isMobile ? "12px" : "16px" }}>
                      <Plus style={{
                        width: isMobile ? "18px" : "20px",
                        height: isMobile ? "18px" : "20px",
                        color: "#00FFFF",
                        flexShrink: 0,
                      }} />
                      <h2 className="neon-text-cyan" style={{
                        fontSize: isMobile ? "16px" : "18px",
                        fontWeight: "bold",
                        margin: 0,
                      }}>Create Room</h2>
                    </div>

                    {!createdRoom ? (
                      <>
                        <div style={{
                          marginBottom: isMobile ? "12px" : "16px",
                          padding: isMobile ? "10px" : "12px",
                          backgroundColor: "rgba(0,255,255,0.05)",
                          borderRadius: "12px",
                          border: "1px solid rgba(0,255,255,0.2)",
                        }}>
                          <p style={{
                            color: "#00FFFF",
                            fontSize: isMobile ? "12px" : "13px",
                            fontWeight: 600,
                            marginBottom: isMobile ? "6px" : "8px",
                          }}>📋 How to Create a Room</p>
                          <ul style={{
                            color: "#9ca3af",
                            fontSize: isMobile ? "11px" : "12px",
                            margin: 0,
                            paddingLeft: isMobile ? "14px" : "16px",
                            lineHeight: "1.5",
                          }}>
                            <li>Click "Create Room" button below</li>
                            <li>Share the 4-character code with your friend</li>
                            <li>Wait for your friend to join using the code</li>
                            <li>Game starts automatically when both players are ready</li>
                          </ul>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                          <NeonButton
                            variant="cyan"
                            fullWidth
                            onClick={handleCreateRoom}
                            isLoading={isCreating}
                            size="lg"
                            style={{ minHeight: isMobile ? "48px" : "auto", maxWidth: isMobile ? "300px" : "400px" }}
                          >
                            <Plus style={{ width: isMobile ? "16px" : "20px", height: isMobile ? "16px" : "20px" }} />
                            Create Room
                          </NeonButton>
                        </div>
                      </>
                    ) : (
                      <div style={{ textAlign: "center" }}>
                        <p style={{
                          color: "#9ca3af",
                          marginBottom: isMobile ? "8px" : "12px",
                          fontSize: isMobile ? "12px" : "14px",
                        }}>Room Code</p>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: isMobile ? "8px" : "12px",
                          marginBottom: isMobile ? "12px" : "16px",
                          flexWrap: "wrap",
                        }}>
                          <span style={{
                            fontSize: isMobile ? "clamp(28px, 8vw, 36px)" : "clamp(32px, 10vw, 48px)",
                            fontWeight: "bold",
                            color: "#00FFFF",
                            fontFamily: "monospace",
                            letterSpacing: "0.2em",
                            wordBreak: "break-all",
                          }}>
                            {createdRoom.code}
                          </span>
                          <NeonButton variant="yellow" size="md" onClick={handleCopyCode}>
                            {copied ? (
                              <Check style={{ width: isMobile ? "16px" : "20px", height: isMobile ? "16px" : "20px" }} />
                            ) : (
                              <Copy style={{ width: isMobile ? "16px" : "20px", height: isMobile ? "16px" : "20px" }} />
                            )}
                          </NeonButton>
                        </div>
                        {copied && (
                          <p style={{
                            color: "#00FF41",
                            fontSize: isMobile ? "12px" : "14px",
                            marginBottom: isMobile ? "8px" : "12px",
                          }}>✓ Code copied!</p>
                        )}
                        <p style={{ color: "#9ca3af", fontSize: isMobile ? "12px" : "14px" }}>
                          Share this code with your friend
                        </p>
                      </div>
                    )}
                  </NeonCard>
                </motion.div>

                {/* Join Room */}
                <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                  <NeonCard variant="pink" style={{ height: "100%" }} glow>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: isMobile ? "12px" : "16px" }}>
                      <Users style={{
                        width: isMobile ? "18px" : "20px",
                        height: isMobile ? "18px" : "20px",
                        color: "#FF00FF",
                        flexShrink: 0,
                      }} />
                      <h2 className="neon-text-pink" style={{
                        fontSize: isMobile ? "16px" : "18px",
                        fontWeight: "bold",
                        margin: 0,
                      }}>Join Room</h2>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); handleJoinRoom(); }} style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: isMobile ? "10px" : "12px",
                    }}>
                      <NeonInput
                        label="Room Code"
                        placeholder="ABCD"
                        value={roomCode}
                        onChange={handleCodeChange}
                        variant="pink"
                        maxLength={4}
                        style={{
                          textAlign: "center",
                          fontSize: isMobile ? "clamp(18px, 5vw, 24px)" : "20px",
                          letterSpacing: "0.3em",
                          fontFamily: "monospace",
                        }}
                      />
                      {joinError && (
                        <div style={{
                          padding: isMobile ? "10px" : "12px",
                          backgroundColor: "rgba(255,49,49,0.1)",
                          border: "1px solid #FF3131",
                          borderRadius: "12px",
                          color: "#FF3131",
                          fontSize: isMobile ? "12px" : "14px",
                          textAlign: "center",
                        }}>
                          {joinError}
                        </div>
                      )}
                      <NeonButton
                        type="submit"
                        variant="pink"
                        fullWidth
                        isLoading={isJoining}
                        disabled={roomCode.length < 4}
                        size="lg"
                        style={{ minHeight: isMobile ? "48px" : "auto", maxWidth: isMobile ? "300px" : "400px" }}
                      >
                        Join Room
                      </NeonButton>
                    </form>
                  </NeonCard>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="ai"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              style={{ maxWidth: "600px", margin: "0 auto" }}
            >
              <NeonCard variant="green" glow style={{ textAlign: "center" }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: isMobile ? "6px" : "8px",
                  marginBottom: isMobile ? "16px" : "20px",
                  flexWrap: "wrap",
                }}>
                  <Cpu style={{
                    width: isMobile ? "28px" : "32px",
                    height: isMobile ? "28px" : "32px",
                    color: "#00FF41",
                    flexShrink: 0,
                  }} />
                  <h2 className="neon-text-green" style={{
                    fontSize: isMobile ? "18px" : "20px",
                    fontWeight: "bold",
                    margin: 0,
                  }}>HUMAN V/S COMPUTER</h2>
                </div>

                <div style={{ marginBottom: isMobile ? "20px" : "24px" }}>
                  <p style={{
                    color: "#9ca3af",
                    marginBottom: isMobile ? "10px" : "12px",
                    fontSize: isMobile ? "13px" : "15px",
                  }}>Select Difficulty</p>
                  <div style={{
                    display: "flex",
                    gap: isMobile ? "6px" : "8px",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}>
                    {(["easy", "medium", "hard"] as Difficulty[]).map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setDifficulty(diff)}
                        style={{
                          padding: isMobile ? "8px 16px" : "10px 20px",
                          borderRadius: "8px",
                          border: `2px solid ${difficulty === diff ? "#00FF41" : "#1a1a1a"}`,
                          backgroundColor: difficulty === diff ? "rgba(0,255,65,0.1)" : "transparent",
                          color: difficulty === diff ? "#00FF41" : "#666",
                          fontWeight: difficulty === diff ? "bold" : "normal",
                          cursor: "pointer",
                          transition: "all 0.3s",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          fontSize: isMobile ? "11px" : "13px",
                          minHeight: isMobile ? "44px" : "auto",
                        }}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                  <p style={{
                    color: "#6b7280",
                    fontSize: isMobile ? "12px" : "14px",
                    marginTop: isMobile ? "10px" : "12px",
                  }}>
                    {difficulty === "easy" && "🟢 Random moves - Easy to beat"}
                    {difficulty === "medium" && "🟡 Smart moves - Challenging"}
                    {difficulty === "hard" && "🔴 Unbeatable - Good luck!"}
                  </p>
                </div>

                <div className="flex justify-center" style={{ width: "100%" }}>
                  <NeonButton
                    variant="green"
                    fullWidth
                    onClick={handlePlayAI}
                    size="xl"
                    style={{ minHeight: isMobile ? "48px" : "auto", maxWidth: isMobile ? "300px" : "400px" }}
                  >
                    <Cpu style={{ width: isMobile ? "20px" : "24px", height: isMobile ? "20px" : "24px" }} />
                    Player vs AI
                  </NeonButton>
                </div>
              </NeonCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Leaderboard */}
        <div style={{ marginTop: isMobile ? "24px" : "32px" }}>
          <Leaderboard leaderboard={leaderboard} isLoading={isLoadingLeaderboard} />
        </div>
      </main>
    </div>
  );
}
