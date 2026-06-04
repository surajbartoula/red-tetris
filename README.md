# 🎮 Red Tetris

A real-time multiplayer Tetris experience built from scratch using a modern full-stack TypeScript architecture.

Red Tetris combines a high-performance server-authoritative game engine with a React-based frontend to deliver competitive multiplayer matches across concurrent lobbies. All gameplay logic is processed on the server, ensuring fair play, synchronization accuracy, and resistance to client-side cheating.

---

## 🚀 Features

- ⚡ Real-time multiplayer gameplay powered by Socket.IO
- 🎯 Server-authoritative game logic
- 🏠 Multiple concurrent game lobbies
- 🔄 Synchronized gravity and piece movement
- 🧩 Immutable frontend state management with Redux Toolkit
- 🛡 Shared TypeScript contracts between client and server
- ✅ Automated testing with coverage enforcement
- 📦 Modern Vite-powered frontend build system

---

# 🏗 Architecture Overview

The application follows a decoupled client-server architecture where the backend owns the game state and clients act as rendering layers.

```text
┌─────────────┐
│ React Client│
└──────┬──────┘
       │ Socket.IO
       ▼
┌────────────────────┐
│ Node.js Game Server│
├────────────────────┤
│ Game Coordinator   │
│ Room State Machine │
│ Player Entities    │
└────────────────────┘
```

All communication is handled through strongly typed event contracts shared between the frontend and backend.

---

# 🛠 Tech Stack

## Language

- TypeScript (strict mode)

## Backend

- Node.js
- Express
- Native HTTP Server
- Socket.IO

## Frontend

- React
- Vite
- Redux Toolkit

## Testing

- Vitest
- V8 Coverage Provider

---

# 🎯 Backend Design

## Game Coordinator

The `Game` class serves as the top-level orchestrator.

Responsibilities:

- Room lifecycle management
- Player tracking
- Match coordination
- Event routing

## Room State Machine

Each room maintains its own isolated game state.

Responsibilities:

- Gravity loop execution
- Board updates
- Collision detection
- Match progression

## Player Entity

Represents an individual connected player.

Responsibilities:

- Socket management
- Score tracking
- Garbage line generation
- Match statistics

---

# ⚡ Server-Authoritative Gameplay

To prevent cheating and ensure synchronization:

- All board calculations occur on the server.
- Clients send only player inputs.
- The server validates and applies actions.
- Updated board states are broadcast to all participants.

This guarantees that every player observes a consistent game state.

---

# 🔗 Shared Network Contracts

Client and server communicate through shared TypeScript interfaces.

```ts
export interface PlayerState {
  id: string;
  username: string;
  isLeader: boolean;
  score: number;
}

export interface ServerToClientEvents {
  room_updated: (data: { roomId: string; players: PlayerState[] }) => void;

  game_started: () => void;
}
```

Using shared contracts eliminates duplicated models and improves type safety across the entire application.

---

# 📊 Test Coverage

The project enforces coverage thresholds to maintain reliability and code quality.

| Metric     | Threshold |
| ---------- | --------- |
| Statements | 70%       |
| Functions  | 70%       |
| Lines      | 70%       |
| Branches   | 50%       |

Build pipelines can be configured to fail automatically when thresholds are not met.

---

# 💻 Getting Started

## Prerequisites

- Node.js 18+
- npm

---

## Installation

Clone the repository:

```bash
git clone https://github.com/your-username/red-tetris.git

cd red-tetris
```

Install dependencies:

```bash
npm install
```

---

# 🚀 Development

Start the backend server:

```bash
npm run srv-dev
```

The Socket.IO server will run on:

```text
http://localhost:3004
```

Start the frontend:

```bash
npm run client-dev
```

The Vite development server will run on:

```text
http://localhost:8080
```

---

# 🧪 Testing

Type checking:

```bash
npm run check-types
```

Run unit tests:

```bash
npm test
```

Generate coverage reports:

```bash
npm run coverage
```

---

# 📦 Production Build

Create a production-ready frontend build:

```bash
npm run client-dist
```

---

# 📁 Project Structure

```text
red-tetris/
│
├── client/          # React frontend
├── server/          # Express + Socket.IO backend
├── shared/          # Shared TypeScript types
├── tests/           # Unit tests
│
├── package.json
└── README.md
```

---

# 🔮 Future Improvements

- Spectator mode
- Ranked matchmaking
- Persistent player statistics
- Replay system
- Tournament support
- Docker deployment
- Horizontal server scaling

---

# 📄 License

This project is licensed under the MIT License.

Feel free to fork, modify, and contribute.
