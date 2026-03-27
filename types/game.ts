export type CellValue = "X" | "O" | null;

export type GameStatus =
  | "waiting"
  | "playing"
  | "won"
  | "lost"
  | "draw"
  | "opponent-won";

export type GameResult = "win" | "loss" | "draw" | null;

export type TurnPlayer = "X" | "O";

export interface Player {
  id: string;
  name: string;
  symbol: TurnPlayer;
  isOnline: boolean;
}

export interface Room {
  id: string;
  code: string;
  creatorId: string;
  creatorName: string;
  playerX: Player | null;
  playerO: Player | null;
  isPublic: boolean;
  board: CellValue[];
  currentTurn: TurnPlayer;
  gameStatus: "waiting" | "playing" | "finished";
  winner: TurnPlayer | null;
  winningLine: number[] | null;
  rematchRequestedBy: string | null;
  createdAt: number;
}

export interface MoveResult {
  success: boolean;
  board: CellValue[];
  currentTurn: TurnPlayer;
  winner: TurnPlayer | null;
  winningLine: number[] | null;
  isDraw: boolean;
  lastMove: number | null;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  message: string;
  senderName: string;
  senderId: string;
  timestamp: number;
  isSystem?: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  wins: number;
  totalGames: number;
  winRate: number;
}

export interface OnlineStats {
  wins: number;
  losses: number;
  draws: number;
  totalGames: number;
}
