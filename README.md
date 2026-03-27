# 🎮 Tic-Tac-Toe Online - Real-Time Multiplayer Game

A full-stack, production-ready real-time Tic-Tac-Toe game built with **Next.js 14**, **Socket.IO**, **TypeScript**, and a stunning **neon-themed UI**. Features secure authentication, live multiplayer gameplay, AI opponent, and responsive design for all devices.

![Tic-Tac-Toe Online](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4-green?logo=socket.io&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss&logoColor=white)

---

## ✨ Features

### 🎯 Core Gameplay
- **Real-Time Multiplayer**: Play against friends or random opponents using WebSocket technology
- **AI Opponent**: Practice against computer with 3 difficulty levels (Easy, Medium, Hard)
- **Private & Public Rooms**: Create private rooms with shareable 4-character codes or join public matches
- **Quick Match**: Instantly find a random opponent
- **Rematch System**: Request and accept rematches after games end

### 🔐 Authentication & Security
- **Email/Password Authentication**: Secure user accounts with bcrypt password hashing
- **Protected Routes**: Middleware-based route protection
- **Rate Limiting**: IP-based rate limiting for API endpoints
- **JWT Sessions**: Secure session management with NextAuth.js

### 🎨 UI/UX Features
- **Neon Dark Theme**: Beautiful, modern UI with glowing neon effects
- **Fully Responsive**: Optimized for mobile, tablet, laptop, and desktop
- **Smooth Animations**: Framer Motion powered transitions and effects
- **Particle Background**: Interactive particle system on landing page
- **Turn Timer**: 30-second turn timer with visual countdown
- **Toast Notifications**: Real-time feedback for all actions

### 📊 Statistics & Social
- **Leaderboard**: Track wins, losses, and win rates globally
- **Game History**: Save and track all game results
- **Live Chat**: In-game chat with message history (optional feature)

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 + Custom CSS |
| **Animations** | Framer Motion |
| **Real-Time** | Socket.IO 4 |
| **Database** | PostgreSQL (Neon Serverless) |
| **ORM** | Prisma 5 |
| **Auth** | NextAuth.js 4 (Credentials Provider) |
| **Password** | bcryptjs (12 rounds) |
| **Validation** | Zod |
| **Particles** | tsParticles |
| **Icons** | Lucide React |
| **UI Components** | Radix UI (Switch, Progress, Tooltip) |
| **Notifications** | react-hot-toast, sonner |
| **Confetti** | react-confetti |
| **Number Animation** | react-countup |

---

## 📦 Installation & Setup

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Generate secret with: openssl rand -base64 32

# Neon Database
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
DIRECT_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
```

### 3. Set Up Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the game.

---

## 🎮 How to Play

### Getting Started
1. **Sign Up / Log In**: Create an account or sign in to your existing account
2. **Navigate to Lobby**: Click "Play Now" or navigate to `/lobby`

### Game Modes

#### 🫂 Multiplayer Mode
1. **Create Room**: 
   - Click "Create Room" button
   - Choose Public (visible to all) or Private (code required)
   - Share the 4-character code with your friend
2. **Join Room**: 
   - Enter the 4-character room code
   - Click "Join Room"
3. **Quick Match**: Click "Quick Match" to find a random opponent instantly

#### 🤖 vs Computer Mode
1. Select difficulty: Easy, Medium, or Hard
2. Click "Play vs AI"
3. Enjoy single-player gameplay

### Gameplay Rules
1. **X goes first** - Player who creates/joins first is X
2. **Alternate turns** - Players take turns placing their marks
3. **Win condition** - Get 3 marks in a row (horizontal, vertical, or diagonal)
4. **Draw** - If all 9 cells are filled with no winner
5. **Turn timer** - 30 seconds per turn
6. **Rematch** - After game ends, either player can request a rematch

---

## 📁 Project Structure

```
tic-tac-toe-online/
├── app/
│   ├── api/                  # API Routes
│   │   ├── auth/[...nextauth]/   # NextAuth endpoints
│   │   ├── scores/               # Leaderboard API
│   │   └── signup/               # User registration
│   ├── lobby/                # Lobby page (create/join rooms)
│   ├── login/                # Login page
│   ├── play-ai/              # AI opponent game page
│   ├── room/[roomId]/        # Game room page
│   ├── signup/               # Signup page
│   ├── socket-test/          # Socket testing page
│   ├── globals.css           # Global styles & animations
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Landing page
├── components/
│   ├── auth/                 # Login, Signup, UserAvatar
│   ├── game/                 # Board, Cells, Timer, Status
│   ├── lobby/                # CreateRoom, JoinRoom, RoomList
│   ├── leaderboard/          # Leaderboard component
│   └── ui/                   # Reusable UI (Button, Card, Input)
├── hooks/                    # Custom React hooks
│   ├── useOnlineGame.ts      # Online game logic
│   └── useSocket.ts          # Socket connection hook
├── lib/                      # Utilities
│   ├── prisma.ts             # Prisma client instance
│   ├── socket-client.ts      # Socket.IO client setup
│   └── utils.ts              # Helper functions
├── prisma/                   # Database
│   └── schema.prisma         # Prisma schema
├── server/                   # Backend
│   ├── socket.ts             # Socket.IO event handlers
│   └── roomManager.ts        # Room management logic
├── types/                    # TypeScript types
│   ├── game.ts               # Game-related types
│   └── socket.ts             # Socket event types
├── auth.ts                   # NextAuth configuration
├── middleware.ts             # Route protection & rate limiting
├── server.js                 # Custom server with Socket.IO
└── tailwind.config.ts        # Tailwind configuration
```

---

## 🔌 Socket.IO Events

### Client → Server Events

| Event | Parameters | Description |
|-------|-----------|-------------|
| `create-room` | `{ userId, userName, isPublic }` | Create a new game room |
| `join-room` | `{ roomId, userId, userName }` | Join an existing room |
| `make-move` | `{ roomId, cellIndex, playerId }` | Make a move on the board |
| `request-rematch` | `{ roomId, playerId }` | Request a rematch |
| `accept-rematch` | `{ roomId, playerId }` | Accept a rematch request |
| `reject-rematch` | `{ roomId }` | Reject a rematch request |
| `leave-room` | `{ roomId }` | Leave the current room |
| `get-public-rooms` | - | Get list of public rooms |

### Server → Client Events

| Event | Data | Description |
|-------|------|-------------|
| `room-created` | `{ room, roomId, roomCode }` | Room created successfully |
| `room-joined` | `{ room, roomId, roomCode }` | Joined a room |
| `player-joined` | `{ room, player }` | New player joined the room |
| `board-updated` | `{ board, currentTurn, lastMove }` | Board state updated |
| `game-over` | `{ winner, winningLine, room }` | Game ended |
| `rematch-requested` | `{ requestedBy, roomId }` | Opponent requested rematch |
| `rematch-started` | `{ room }` | Rematch beginning |
| `rematch-rejected` | `{ message }` | Rematch was rejected |
| `opponent-left` | `{ message }` | Opponent disconnected |
| `public-rooms-list` | `{ rooms }` | List of public rooms |
| `error` | `{ message }` | Error occurred |

---

## 🗄️ Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  scores    Score[]
  createdAt DateTime @default(now())
}

model Score {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  game      String   // "tictactoe"
  result    String   // "win" | "loss" | "draw"
  opponent  String?
  createdAt DateTime @default(now())
  
  @@index([game])
}
```

---

## 🔐 Authentication Flow

1. **Registration**: User signs up with email/password
2. **Password Hashing**: Password hashed with bcrypt (12 rounds)
3. **JWT Token**: NextAuth creates JWT token with user info
4. **Session**: Session stored in browser cookie
5. **Protected Routes**: Middleware validates token for `/lobby`, `/room/*`

### Middleware Protection

```typescript
// Protected paths
- /lobby/*
- /room/*

// Public paths
- /login
- /signup
- /api/signup
- /api/auth/*
- /
- /api/socket
```

---

## 🎨 UI Components

### Core Components

| Component | Description | Variants |
|-----------|-------------|----------|
| `NeonButton` | Glowing button component | cyan, pink, green, yellow, red, purple |
| `NeonCard` | Card container with neon border | cyan, pink, green, yellow |
| `NeonInput` | Styled input field | cyan, pink, green |
| `LoadingSpinner` | Animated loading indicator | cyan, pink, green, yellow |
| `UserAvatar` | User profile display with initials | - |

### Game Components

| Component | Description |
|-----------|-------------|
| `OnlineBoard` | 3x3 interactive game board |
| `GameCell` | Individual board cell with animations |
| `GameStatus` | Current game state display |
| `TurnTimer` | 30-second countdown timer |
| `PlayerInfo` | Player name and symbol display |

---

## 🚀 Production Deployment

### Environment Variables for Production

```env
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret-key
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
DIRECT_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
```

### Build & Deploy

```bash
# Install dependencies
npm install

# Generate Prisma Client
npm run db:generate

# Push database schema
npm run db:push

# Build Next.js application
npm run build

# Start production server
npm start
```

### Recommended Hosting

- **Vercel**: Best for Next.js (free tier available)
- **Railway**: Great for Node.js + PostgreSQL
- **Neon**: Serverless PostgreSQL (free tier available)

---

## 📝 API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/signup` | Register new user |
| `POST` | `/api/auth/[...nextauth]` | NextAuth authentication |
| `GET` | `/api/scores` | Get leaderboard data |
| `POST` | `/api/scores` | Save game result |
| `GET` | `/api/socket` | Socket.IO initialization |

---

## 🎯 Game Rules

1. **X always goes first** - Determined by join order
2. **Players alternate turns** - X → O → X → O...
3. **Win condition** - First to get 3 in a row wins
4. **Draw** - All 9 cells filled with no winner
5. **Turn timer** - 30 seconds per turn (auto-skip on timeout)
6. **Rematch** - Both players must accept for rematch to start

---

## 🧪 Testing & Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm start            # Start production server

# Database
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema to database

# Code Quality
npm run lint         # Run ESLint
```

---

## 📱 Responsive Design

The game is fully responsive and tested on:

- 📱 **Mobile**: 320px - 640px
- 📱 **Tablet**: 641px - 1024px
- 💻 **Laptop**: 1025px - 1440px
- 🖥️ **Desktop**: 1441px+

All UI elements use `clamp()` for fluid typography and spacing.

---

## 🙏 Credits

Built with amazing open-source libraries:

- [Next.js](https://nextjs.org/) - React Framework
- [Socket.IO](https://socket.io/) - Real-Time Communication
- [Tailwind CSS](https://tailwindcss.com/) - Utility-First CSS
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Prisma](https://www.prisma.io/) - Database ORM
- [Neon Database](https://neon.tech/) - Serverless PostgreSQL
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Radix UI](https://www.radix-ui.com/) - Accessible Components
- [Lucide React](https://lucide.dev/) - Icons

---

## 📄 License

**MIT License** - Feel free to use this project for learning, personal projects, or commercial purposes.

```
Copyright (c) 2024 Tic-Tac-Toe Online

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software.
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: [Your Email]

---

**Made with Muhammad Rohan Mirza ❤️ using Next.js, Socket.IO, and TypeScript**
