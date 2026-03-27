export type CellValue = "X" | "O" | null;
export type Difficulty = "easy" | "medium" | "hard";

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function checkWinner(board: CellValue[]): { winner: CellValue; line: number[] | null } {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

function isBoardFull(board: CellValue[]): boolean {
  return board.every(cell => cell !== null);
}

function getEmptyCells(board: CellValue[]): number[] {
  return board.map((cell, index) => cell === null ? index : -1).filter(i => i !== -1);
}

// Minimax algorithm with alpha-beta pruning
function minimax(
  board: CellValue[],
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number
): number {
  const { winner } = checkWinner(board);

  // Terminal states
  if (winner === "O") return 10 - depth; // AI wins
  if (winner === "X") return depth - 10; // Human wins
  if (isBoardFull(board)) return 0; // Draw

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const index of getEmptyCells(board)) {
      board[index] = "O";
      const score = minimax(board, depth + 1, false, alpha, beta);
      board[index] = null;
      bestScore = Math.max(score, bestScore);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (const index of getEmptyCells(board)) {
      board[index] = "X";
      const score = minimax(board, depth + 1, true, alpha, beta);
      board[index] = null;
      bestScore = Math.min(score, bestScore);
      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }
    return bestScore;
  }
}

export function getBestMove(board: CellValue[], difficulty: Difficulty): number {
  const emptyCells = getEmptyCells(board);

  if (emptyCells.length === 0) return -1;

  // Easy: Random move
  if (difficulty === "easy") {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
  }

  // Medium: 50% random, 50% best move
  if (difficulty === "medium") {
    if (Math.random() < 0.5) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      return emptyCells[randomIndex];
    }
  }

  // Hard: Always best move (unbeatable)
  let bestScore = -Infinity;
  let bestMove = emptyCells[0];

  for (const index of emptyCells) {
    board[index] = "O";
    const score = minimax(board, 0, false, -Infinity, Infinity);
    board[index] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMove = index;
    }
  }

  console.log(`[AI] Best move: ${bestMove}, score: ${bestScore}`);
  return bestMove;
}

export function checkDraw(board: CellValue[]): boolean {
  return isBoardFull(board) && !checkWinner(board).winner;
}
