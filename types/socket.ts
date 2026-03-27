import { Room, CellValue, TurnPlayer, ChatMessage } from "./game";

// Client to Server Events
export interface ClientToServerEvents {
  "create-room": (data: CreateRoomData) => void;
  "join-room": (data: JoinRoomData) => void;
  "make-move": (data: MakeMoveData) => void;
  "send-message": (data: SendMessageData) => void;
  "request-rematch": (data: RematchData) => void;
  "accept-rematch": (data: RematchData) => void;
  "reject-rematch": (data: RejectRematchData) => void;
  "leave-room": (data: LeaveRoomData) => void;
  "get-public-rooms": () => void;
}

// Server to Client Events
export interface ServerToClientEvents {
  "room-created": (room: Room) => void;
  "room-joined": (room: Room) => void;
  "player-joined": (data: PlayerJoinedData) => void;
  "board-updated": (data: BoardUpdatedData) => void;
  "game-over": (data: GameOverData) => void;
  "new-message": (message: ChatMessage) => void;
  "rematch-requested": (data: RematchRequestedData) => void;
  "rematch-started": (room: Room) => void;
  "rematch-rejected": (data: RematchRejectedData) => void;
  "opponent-left": (data: OpponentLeftData) => void;
  "public-rooms-list": (data: PublicRoomsListData) => void;
  "timer-update": (data: TimerUpdateData) => void;
  "turn-timeout": (data: TurnTimeoutData) => void;
  error: (data: ErrorData) => void;
}

// Event Data Types
export interface CreateRoomData {
  userId: string;
  userName: string;
  isPublic: boolean;
}

export interface JoinRoomData {
  roomId: string;
  userId: string;
  userName: string;
}

export interface MakeMoveData {
  roomId: string;
  cellIndex: number;
  playerId: string;
}

export interface SendMessageData {
  roomId: string;
  message: string;
  senderName: string;
  senderId: string;
}

export interface RematchData {
  roomId: string;
  playerId: string;
}

export interface RejectRematchData {
  roomId: string;
}

export interface LeaveRoomData {
  roomId: string;
}

export interface PlayerJoinedData {
  player: {
    id: string;
    name: string;
    symbol: TurnPlayer;
  };
  room: Room;
}

export interface BoardUpdatedData {
  board: CellValue[];
  currentTurn: TurnPlayer;
  lastMove: number | null;
}

export interface GameOverData {
  winner: TurnPlayer | "draw";
  winningLine: number[] | null;
  room: Room;
}

export interface RematchRequestedData {
  requestedBy: string;
  roomId?: string;
}

export interface RematchRejectedData {
  message: string;
}

export interface OpponentLeftData {
  message: string;
}

export interface PublicRoomsListData {
  rooms: Room[];
}

export interface TimerUpdateData {
  secondsLeft: number;
}

export interface TurnTimeoutData {
  roomId: string;
}

export interface ErrorData {
  message: string;
}
