"use client";

import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  CreateRoomData,
  JoinRoomData,
  MakeMoveData,
  SendMessageData,
  RematchData,
  LeaveRoomData,
} from "@/types/socket";
import { Room, CellValue, TurnPlayer, ChatMessage } from "@/types/game";

export function useSocket() {
  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      process.env.NEXT_PUBLIC_URL ||
      "https://tic-tac-toe-online-game-07.vercel.app";

    const newSocket = io(socketUrl, {
      path: "/api/socket",
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const createRoom = useCallback(
    (data: CreateRoomData) => {
      socket?.emit("create-room", data);
    },
    [socket]
  );

  const joinRoom = useCallback(
    (data: JoinRoomData) => {
      socket?.emit("join-room", data);
    },
    [socket]
  );

  const makeMove = useCallback(
    (data: MakeMoveData) => {
      socket?.emit("make-move", data);
    },
    [socket]
  );

  const sendMessage = useCallback(
    (data: SendMessageData) => {
      socket?.emit("send-message", data);
    },
    [socket]
  );

  const requestRematch = useCallback(
    (data: RematchData) => {
      socket?.emit("request-rematch", data);
    },
    [socket]
  );

  const acceptRematch = useCallback(
    (data: RematchData) => {
      socket?.emit("accept-rematch", data);
    },
    [socket]
  );

  const leaveRoom = useCallback(
    (data: LeaveRoomData) => {
      socket?.emit("leave-room", data);
    },
    [socket]
  );

  const getPublicRooms = useCallback(() => {
    socket?.emit("get-public-rooms");
  }, [socket]);

  const disconnect = useCallback(() => {
    socket?.disconnect();
  }, [socket]);

  return {
    socket,
    isConnected,
    createRoom,
    joinRoom,
    makeMove,
    sendMessage,
    requestRematch,
    acceptRematch,
    leaveRoom,
    getPublicRooms,
    disconnect,
  };
}
