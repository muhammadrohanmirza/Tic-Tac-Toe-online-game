"use client";

import { useState, useEffect, useCallback } from "react";
import { useSocket } from "./useSocket";
import { Room, CellValue, TurnPlayer, ChatMessage, Player } from "@/types/game";
import {
  PlayerJoinedData,
  BoardUpdatedData,
  GameOverData,
  RematchRequestedData,
  OpponentLeftData,
  PublicRoomsListData,
  TimerUpdateData,
  TurnTimeoutData,
  ErrorData,
} from "@/types/socket";

interface UseOnlineGameReturn {
  room: Room | null;
  board: CellValue[];
  currentTurn: TurnPlayer;
  gameStatus: "waiting" | "playing" | "finished";
  winner: TurnPlayer | "draw" | null;
  winningLine: number[] | null;
  lastMove: number | null;
  players: { playerX: Player | null; playerO: Player | null };
  messages: ChatMessage[];
  secondsLeft: number;
  error: string | null;
  publicRooms: Room[];
  isLoading: boolean;
  isRematchRequested: boolean;
  createRoom: (isPublic: boolean) => void;
  joinRoom: (roomId: string) => void;
  makeMove: (cellIndex: number) => void;
  sendMessage: (message: string) => void;
  requestRematch: () => void;
  acceptRematch: () => void;
  rejectRematch: () => void;
  leaveRoom: () => void;
  refreshPublicRooms: () => void;
  clearError: () => void;
}

export function useOnlineGame(
  userId: string,
  userName: string
): UseOnlineGameReturn {
  const {
    socket,
    isConnected,
    createRoom: socketCreateRoom,
    joinRoom: socketJoinRoom,
    makeMove: socketMakeMove,
    sendMessage: socketSendMessage,
    requestRematch: socketRequestRematch,
    acceptRematch: socketAcceptRematch,
    leaveRoom: socketLeaveRoom,
    getPublicRooms: socketGetPublicRooms,
  } = useSocket();

  const [room, setRoom] = useState<Room | null>(null);
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState<TurnPlayer>("X");
  const [gameStatus, setGameStatus] = useState<"waiting" | "playing" | "finished">(
    "waiting"
  );
  const [winner, setWinner] = useState<TurnPlayer | "draw" | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [lastMove, setLastMove] = useState<number | null>(null);
  const [players, setPlayers] = useState<{
    playerX: Player | null;
    playerO: Player | null;
  }>({ playerX: null, playerO: null });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [secondsLeft, setSecondsLeft] = useState<number>(30);
  const [error, setError] = useState<string | null>(null);
  const [publicRooms, setPublicRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRematchRequested, setIsRematchRequested] = useState(false);

  useEffect(() => {
    if (!socket) return;

    socket.on("room-created", (createdRoom: Room) => {
      setRoom(createdRoom);
      setGameStatus(createdRoom.gameStatus);
      setPlayers({
        playerX: createdRoom.playerX,
        playerO: createdRoom.playerO,
      });
      setIsLoading(false);
    });

    socket.on("room-joined", (joinedRoom: Room) => {
      setRoom(joinedRoom);
      setBoard(joinedRoom.board);
      setCurrentTurn(joinedRoom.currentTurn);
      setGameStatus(joinedRoom.gameStatus);
      setPlayers({
        playerX: joinedRoom.playerX,
        playerO: joinedRoom.playerO,
      });
      setIsLoading(false);
    });

    socket.on("player-joined", (data: PlayerJoinedData) => {
      setRoom(data.room);
      setPlayers({
        playerX: data.room.playerX,
        playerO: data.room.playerO,
      });
      setGameStatus(data.room.gameStatus);
      setBoard(data.room.board);
      setCurrentTurn(data.room.currentTurn);
    });

    socket.on("board-updated", (data: BoardUpdatedData) => {
      setBoard(data.board);
      setCurrentTurn(data.currentTurn);
      setLastMove(data.lastMove);
      setSecondsLeft(30);
    });

    socket.on("game-over", (data: GameOverData) => {
      setGameStatus("finished");
      setWinner(data.winner as TurnPlayer | "draw");
      setWinningLine(data.winningLine);
      setRoom(data.room);
    });

    socket.on("new-message", (message: ChatMessage) => {
      setMessages((prev) => [...prev.slice(-49), message]);
    });

    socket.on("rematch-requested", (data: RematchRequestedData) => {
      // Handle rematch request UI
      setIsRematchRequested(true);
    });

    socket.on("rematch-started", (newRoom: Room) => {
      setRoom(newRoom);
      setBoard(newRoom.board);
      setCurrentTurn(newRoom.currentTurn);
      setGameStatus(newRoom.gameStatus);
      setWinner(null);
      setWinningLine(null);
      setLastMove(null);
      setSecondsLeft(30);
      setIsRematchRequested(false);
    });

    socket.on("rematch-rejected", () => {
      setIsRematchRequested(false);
      setError("Opponent declined rematch");
    });

    socket.on("opponent-left", (data: OpponentLeftData) => {
      setError(data.message);
      if (room) {
        setPlayers((prev) => ({
          playerX: room.playerX?.id === userId ? prev.playerX : null,
          playerO: room.playerO?.id === userId ? prev.playerO : null,
        }));
      }
    });

    socket.on("public-rooms-list", (data: PublicRoomsListData) => {
      setPublicRooms(data.rooms);
    });

    socket.on("timer-update", (data: TimerUpdateData) => {
      setSecondsLeft(data.secondsLeft);
    });

    socket.on("turn-timeout", (data: TurnTimeoutData) => {
      setSecondsLeft(30);
    });

    socket.on("error", (data: ErrorData) => {
      setError(data.message);
      setIsLoading(false);
    });

    return () => {
      socket.off("room-created");
      socket.off("room-joined");
      socket.off("player-joined");
      socket.off("board-updated");
      socket.off("game-over");
      socket.off("new-message");
      socket.off("rematch-requested");
      socket.off("rematch-started");
      socket.off("rematch-rejected");
      socket.off("opponent-left");
      socket.off("public-rooms-list");
      socket.off("timer-update");
      socket.off("turn-timeout");
      socket.off("error");
    };
  }, [socket, userId, room]);

  const createRoom = useCallback(
    (isPublic: boolean) => {
      if (!socket || !userId || !userName) return;
      setIsLoading(true);
      setError(null);
      socketCreateRoom({ userId, userName, isPublic });
    },
    [socket, userId, userName, socketCreateRoom]
  );

  const joinRoom = useCallback(
    (roomId: string) => {
      if (!socket || !userId || !userName) return;
      setIsLoading(true);
      setError(null);
      socketJoinRoom({ roomId, userId, userName });
    },
    [socket, userId, userName, socketJoinRoom]
  );

  const makeMove = useCallback(
    (cellIndex: number) => {
      if (!socket || !room) return;
      const playerId =
        players.playerX?.id === userId
          ? players.playerX.id
          : players.playerO?.id || "";
      socketMakeMove({ roomId: room.id, cellIndex, playerId });
    },
    [socket, room, players, userId, socketMakeMove]
  );

  const sendMessage = useCallback(
    (message: string) => {
      if (!socket || !room || !userName) return;
      socketSendMessage({
        roomId: room.id,
        message,
        senderName: userName,
        senderId: userId,
      });
    },
    [socket, room, userName, userId, socketSendMessage]
  );

  const requestRematch = useCallback(() => {
    if (!socket || !room) return;
    socketRequestRematch({ roomId: room.id, playerId: userId });
  }, [socket, room, userId, socketRequestRematch]);

  const acceptRematch = useCallback(() => {
    if (!socket || !room) return;
    socketAcceptRematch({ roomId: room.id, playerId: userId });
  }, [socket, room, userId, socketAcceptRematch]);

  const rejectRematch = useCallback(() => {
    if (!socket || !room) return;
    socket.emit("reject-rematch", { roomId: room.id });
  }, [socket, room]);

  const leaveRoom = useCallback(() => {
    if (!socket || !room) return;
    socketLeaveRoom({ roomId: room.id });
    setRoom(null);
    setBoard(Array(9).fill(null));
    setCurrentTurn("X");
    setGameStatus("waiting");
    setWinner(null);
    setWinningLine(null);
    setLastMove(null);
    setPlayers({ playerX: null, playerO: null });
    setMessages([]);
    setSecondsLeft(30);
  }, [socket, room, socketLeaveRoom]);

  const refreshPublicRooms = useCallback(() => {
    socketGetPublicRooms();
  }, [socketGetPublicRooms]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    room,
    board,
    currentTurn,
    gameStatus,
    winner,
    winningLine,
    lastMove,
    players,
    messages,
    secondsLeft,
    error,
    publicRooms,
    isLoading,
    isRematchRequested,
    createRoom,
    joinRoom,
    makeMove,
    sendMessage,
    requestRematch,
    acceptRematch,
    rejectRematch,
    leaveRoom,
    refreshPublicRooms,
    clearError,
  };
}
