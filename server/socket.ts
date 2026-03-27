import { Server, Socket } from 'socket.io'
import { roomManager } from './roomManager'

export function setupSocketEvents(io: Server) {
  console.log('[Socket] Setting up socket event handlers...')

  io.on('connection', (socket: Socket) => {
    console.log('✅ Client connected:', socket.id)

    socket.on('create-room', (data) => {
      console.log('create-room received:', data)
      const { userId, userName, isPublic } = data

      if (!userId || !userName) {
        socket.emit('error', { message: 'User info missing' })
        return
      }

      const player = {
        id: userId,
        name: userName,
        socketId: socket.id,
        symbol: 'X' as const
      }

      const room = roomManager.createRoom(player, isPublic)
      socket.join(room.id)

      console.log('Room created:', room.id, room.code)

      socket.emit('room-created', {
        room: room,
        roomId: room.id,
        roomCode: room.code
      })
    })

    socket.on('join-room', (data) => {
      console.log('join-room received:', data)
      const { roomId, userId, userName } = data

      if (!roomId || !userId) {
        socket.emit('error', { message: 'Missing room code or user info' })
        return
      }

      const player = {
        id: userId,
        name: userName,
        socketId: socket.id,
        symbol: 'O' as const
      }

      // Only uppercase if it's a 4-character room code, not a UUID
      const lookupId = roomId.length === 4 ? roomId.toUpperCase() : roomId
      const result = roomManager.joinRoom(lookupId, player)

      if (result.error) {
        socket.emit('error', { message: result.error })
        return
      }

      const room = result.room!
      socket.join(room.id)

      console.log('Player joined:', room.id, room.code)

      socket.emit('room-joined', {
        room: room,
        roomId: room.id,
        roomCode: room.code
      })

      socket.to(room.id).emit('player-joined', {
        room: room,
        roomId: room.id,
        player: player
      })
    })

    socket.on('make-move', (data) => {
      const { roomId, cellIndex, playerId } = data
      console.log('make-move:', roomId, cellIndex)

      const result = roomManager.makeMove(roomId, cellIndex, playerId)

      if (result.error) {
        socket.emit('error', { message: result.error })
        return
      }

      io.to(roomId).emit('board-updated', {
        board: result.board,
        currentTurn: result.nextTurn,
        lastMove: cellIndex
      })

      if (result.gameOver) {
        io.to(roomId).emit('game-over', {
          winner: result.winner,
          winningLine: result.winningLine,
          isDraw: result.isDraw
        })
      }
    })

    socket.on('send-message', (data) => {
      const { roomId, message, senderName } = data
      io.to(roomId).emit('new-message', {
        message,
        senderName,
        timestamp: new Date().toISOString()
      })
    })

    socket.on('get-room', (data) => {
      const { roomId, userId } = data
      // Only uppercase if it's a 4-character room code, not a UUID
      const lookupId = roomId.length === 4 ? roomId.toUpperCase() : roomId
      const room = roomManager.getRoom(lookupId)
      if (room) {
        // Update player's socket ID if they reconnected
        if (userId) {
          roomManager.updatePlayerSocket(room.id, userId, socket.id)
        }
        socket.join(room.id)
        socket.emit('room-data', { room })
      } else {
        socket.emit('error', { message: 'Room not found' })
      }
    })

    socket.on('get-public-rooms', () => {
      const rooms = roomManager.getPublicRooms()
      socket.emit('public-rooms-list', { rooms })
    })

    socket.on('request-rematch', (data) => {
      const { roomId, playerId } = data
      const result = roomManager.requestRematch(roomId, playerId)
      if (result.error) {
        socket.emit('error', { message: result.error })
        return
      }
      // Notify the other player about the rematch request
      socket.to(roomId).emit('rematch-requested', {
        requestedBy: playerId,
        roomId
      })
    })

    socket.on('accept-rematch', (data) => {
      const { roomId, playerId } = data
      const room = roomManager.resetRoom(roomId)
      if (room) {
        io.to(roomId).emit('rematch-started', { room })
      }
    })

    socket.on('reject-rematch', (data) => {
      const { roomId } = data
      roomManager.rejectRematch(roomId)
      // Notify the requester that rematch was rejected
      socket.to(roomId).emit('rematch-rejected', {
        message: 'Opponent declined rematch'
      })
    })

    socket.on('leave-room', (data) => {
      const { roomId } = data
      socket.leave(roomId)
      roomManager.leaveRoom(roomId, socket.id)
      socket.to(roomId).emit('opponent-left', {
        message: 'Opponent left the game'
      })
    })

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id)
      roomManager.handleDisconnect(socket.id)
    })
  })

  console.log('[Socket] Socket event handlers setup complete')
}
