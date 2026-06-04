import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import { ClientToServerEvents, ServerToClientEvents } from "../shared/types.js";

// Recreate __dirname since it is not globally available in native ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Initialize Express app and create the HTTP Server
const app = express();
const httpServer = createServer(app);

// 2. Initialize Socket.io using the HTTP Server instance
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: "http://localhost:8080", // Allows your Vite dev server to connect
    methods: ["GET", "POST"],
  },
});

// Production Layer: Serve the compiled frontend bundle
if (process.env["NODE_ENV"] === "production") {
  const clientBuildPath = path.join(__dirname, "../../dist/client");

  app.use(express.static(clientBuildPath));

  app.get("*", (_req: Request, res: Response) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

// Real-Time Layer: Socket.io Event Handling
io.on("connection", (socket: Socket) => {
  console.log(`[Socket Connection] Player connected: ${socket.id}`);

  // Listen for when a player joins a room
  socket.on("join_room", ({ username, roomId }) => {
    socket.join(roomId);
    console.log(`Player ${username} (${socket.id}) joined room: ${roomId}`);

    // Mock response back to everyone in the room
    io.to(roomId).emit("room_updated", {
      roomId,
      players: [{ id: socket.id, username, isLeader: true, score: 0 }],
    });
  });

  socket.on("disconnect", () => {
    console.log(`[Socket Disconnect] Player disconnected: ${socket.id}`);
  });
});

// 3. Start the server on port 3004
const PORT = process.env["PORT"] || 3004;
httpServer.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 Red Tetris Server listening on http://0.0.0.0:${PORT}`);
  console.log(`===================================================`);
});
