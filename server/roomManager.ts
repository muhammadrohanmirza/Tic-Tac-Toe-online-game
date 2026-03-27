import { v4 as uuidv4 } from 'uuid'

interface Player {
  id: string
  name: string
  socketId: string
  symbol: 'X' | 'O'
}

interface Room {
  id: string
  code: string
  player1: Player | null
  player2: Player | null
  board: string[]
  currentTurn: 'X' | 'O'
  status: 'waiting' | 'playing' | 'finished'
  winner: string | null
  winningLine: number[] | null
  isPublic: boolean
  createdAt: Date
  rematchRequestedBy: string | null
}

const WINNING_COMBOS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
]

class RoomManager {
  private rooms = new Map<string, Room>()

  generateCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)]
    }
    return code
  }

  createRoom(player: Player, isPublic: boolean): Room {
    const room: Room = {
      id: uuidv4(),
      code: this.generateCode(),
      player1: player,
      player2: null,
      board: Array(9).fill(''),
      currentTurn: 'X',
      status: 'waiting',
      winner: null,
      winningLine: null,
      isPublic,
      createdAt: new Date(),
      rematchRequestedBy: null
    }
    this.rooms.set(room.id, room)
    console.log(`[RoomManager] Room created: ${room.id} (${room.code})`)
    return room
  }

  joinRoom(codeOrId: string, player: Player) {
    let room: Room | undefined

    // Search by code first
    const roomsArray = Array.from(this.rooms.values())
    for (const r of roomsArray) {
      if (r.code === codeOrId.toUpperCase()) {
        room = r
        break
      }
    }

    // Search by id if not found by code
    if (!room) {
      room = this.rooms.get(codeOrId)
    }

    if (!room) {
      console.log(`[RoomManager] Room not found: ${codeOrId}`)
      return { error: 'Room not found' }
    }

    if (room.player2) {
      console.log(`[RoomManager] Room full: ${room.code}`)
      return { error: 'Room is full' }
    }

    if (room.status === 'finished') {
      return { error: 'Game already finished' }
    }

    room.player2 = player
    room.status = 'playing'
    console.log(`[RoomManager] Player joined: ${room.code}`)
    return { room }
  }

  makeMove(roomId: string, cellIndex: number, playerId: string) {
    const room = this.rooms.get(roomId)
    if (!room) return { error: 'Room not found' }

    const playerSymbol = room.player1?.id === playerId ? 'X' : 'O'

    if (room.currentTurn !== playerSymbol) {
      return { error: 'Not your turn' }
    }

    if (room.board[cellIndex] !== '') {
      return { error: 'Cell already taken' }
    }

    room.board[cellIndex] = playerSymbol

    const winResult = this.checkWinner(room.board)
    const isDraw = !winResult && room.board.every(cell => cell !== '')

    if (winResult) {
      room.winner = playerSymbol
      room.winningLine = winResult
      room.status = 'finished'
      console.log(`[RoomManager] Player ${playerSymbol} wins in ${roomId}`)
    } else if (isDraw) {
      room.status = 'finished'
      console.log(`[RoomManager] Draw in ${roomId}`)
    } else {
      room.currentTurn = room.currentTurn === 'X' ? 'O' : 'X'
    }

    return {
      board: room.board,
      nextTurn: room.currentTurn,
      gameOver: room.status === 'finished',
      winner: room.winner,
      winningLine: room.winningLine,
      isDraw
    }
  }

  checkWinner(board: string[]) {
    for (const combo of WINNING_COMBOS) {
      const [a, b, c] = combo
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return combo
      }
    }
    return null
  }

  getRoom(roomId: string) {
    return this.rooms.get(roomId) || null
  }

  getRoomByCode(code: string) {
    const roomsArray = Array.from(this.rooms.values())
    for (const room of roomsArray) {
      if (room.code === code.toUpperCase()) {
        return room
      }
    }
    return null
  }

  getPublicRooms() {
    return Array.from(this.rooms.values())
      .filter(r => r.isPublic && r.status === 'waiting' && r.player2 === null)
  }

  resetRoom(roomId: string) {
    const room = this.rooms.get(roomId)
    if (!room) return null
    room.board = Array(9).fill('')
    room.currentTurn = 'X'
    room.status = 'playing'
    room.winner = null
    room.winningLine = null
    room.rematchRequestedBy = null
    console.log(`[RoomManager] Room reset: ${roomId}`)
    return room
  }

  requestRematch(roomId: string, playerId: string) {
    const room = this.rooms.get(roomId)
    if (!room) return { error: 'Room not found' }
    
    room.rematchRequestedBy = playerId
    console.log(`[RoomManager] Rematch requested by ${playerId} in ${roomId}`)
    return { success: true }
  }

  rejectRematch(roomId: string) {
    const room = this.rooms.get(roomId)
    if (!room) return { error: 'Room not found' }
    
    room.rematchRequestedBy = null
    console.log(`[RoomManager] Rematch rejected in ${roomId}`)
    return { success: true }
  }

  clearRematchRequest(roomId: string) {
    const room = this.rooms.get(roomId)
    if (!room) return null
    room.rematchRequestedBy = null
    return room
  }

  leaveRoom(roomId: string, socketId: string) {
    const room = this.rooms.get(roomId)
    if (!room) return
    
    if (room.player1?.socketId === socketId) {
      // Player 1 is leaving
      if (room.player2) {
        // Player 2 is still here - player1 leaves, player2 becomes player1
        room.player1 = room.player2
        room.player1.symbol = 'X'
        room.player2 = null
        room.status = 'waiting'
        room.currentTurn = 'X'
        room.board = Array(9).fill('')
        room.winner = null
        room.winningLine = null
        console.log(`[RoomManager] Player1 left, player2 kept as player1: ${roomId}`)
      } else {
        // No player2, delete the room
        this.rooms.delete(roomId)
        console.log(`[RoomManager] Room deleted: ${roomId}`)
      }
    } else if (room.player2?.socketId === socketId) {
      // Player 2 is leaving
      room.player2 = null
      room.status = 'waiting'
      room.currentTurn = 'X'
      room.board = Array(9).fill('')
      room.winner = null
      room.winningLine = null
      console.log(`[RoomManager] Player2 left, room waiting: ${roomId}`)
    } else {
      console.log(`[RoomManager] Unknown socket left: ${socketId} from room ${roomId}`)
    }
  }

  updatePlayerSocket(roomId: string, playerId: string, newSocketId: string) {
    const room = this.rooms.get(roomId)
    if (!room) return false
    
    if (room.player1?.id === playerId) {
      room.player1.socketId = newSocketId
      return true
    }
    if (room.player2?.id === playerId) {
      room.player2.socketId = newSocketId
      return true
    }
    return false
  }

  handleDisconnect(socketId: string) {
    // Don't delete room on disconnect - only on explicit leave
    // This prevents room loss during page refresh/navigation
    console.log(`[RoomManager] Client disconnected: ${socketId}`)
    // Room will be cleaned up when player explicitly leaves or after timeout
  }
}

export const roomManager = new RoomManager()
