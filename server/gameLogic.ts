import { CellValue, TurnPlayer, MoveResult } from "@/types/game";

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function checkWinner(board: CellValue[]): {
  winner: TurnPlayer | null;
  winningLine: number[] | null;
} {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as TurnPlayer, winningLine: [a, b, c] };
    }
  }
  return { winner: null, winningLine: null };
}

export function isBoardFull(board: CellValue[]): boolean {
  return board.every((cell) => cell !== null);
}

export function makeMove(
  board: CellValue[],
  cellIndex: number,
  currentPlayer: TurnPlayer
): MoveResult {
  if (cellIndex < 0 || cellIndex > 8) {
    return {
      success: false,
      board: [...board],
      currentTurn: currentPlayer,
      winner: null,
      winningLine: null,
      isDraw: false,
      lastMove: null,
    };
  }

  if (board[cellIndex] !== null) {
    return {
      success: false,
      board: [...board],
      currentTurn: currentPlayer,
      winner: null,
      winningLine: null,
      isDraw: false,
      lastMove: null,
    };
  }

  const newBoard = [...board];
  newBoard[cellIndex] = currentPlayer;

  const { winner, winningLine } = checkWinner(newBoard);
  const isDraw = !winner && isBoardFull(newBoard);
  const nextPlayer: TurnPlayer = currentPlayer === "X" ? "O" : "X";

  return {
    success: true,
    board: newBoard,
    currentTurn: winner ? currentPlayer : nextPlayer,
    winner,
    winningLine,
    isDraw,
    lastMove: cellIndex,
  };
}

export function getEmptyCells(board: CellValue[]): number[] {
  return board
    .map((cell, index) => (cell === null ? index : -1))
    .filter((index) => index !== -1);
}

export function resetBoard(): CellValue[] {
  return Array(9).fill(null);
}
