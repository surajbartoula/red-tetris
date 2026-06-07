import type { Socket, Server } from "socket.io";

import { gameManager } from "../services/GameManager";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  Spectrum,
} from "../../shared/types";

type TypedServer = Server<ClientToServerEvents, ServerToClientEvents>;
type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

export function registerGameHandlers(io: TypedServer, socket: TypedSocket): void {
  let currentRoomId: string | null = null;

  const emitRoomUpdate = (roomId: string): void => {
    const game = gameManager.getGame(roomId);

    if (!game) {
      return;
    }

    io.to(roomId).emit("room_updated", {
      roomId,
      players: game.getPlayersState(),
    });
  };

  const leaveCurrentRoom = (): void => {
    if (!currentRoomId) {
      return;
    }
    const game = gameManager.getGame(currentRoomId);
    const newLeader = game?.removePlayer(socket.id);

    if (!game) {
      currentRoomId = null;
      return;
    }

    game.removePlayer(socket.id);
    socket.leave(currentRoomId);

    emitRoomUpdate(currentRoomId);
    if (newLeader) {
        io.to(currentRoomId).emit("host_changed", newLeader.id);
    }
    gameManager.removeEmptyGame(currentRoomId);

    currentRoomId = null;
  };

  socket.on("join_room", ({ username, roomId }) => {
    try {
        if (currentRoomId) {
            throw new Error("You are already in a room");
        }
      const game = gameManager.getOrCreateGame(roomId);

      game.addPlayer(socket.id, username);
      socket.join(roomId);

      currentRoomId = roomId;

      emitRoomUpdate(roomId);
    } catch (error) {
      socket.emit(
        "error_message",
        error instanceof Error ? error.message : "Unable to join room"
      );
    }
  });

  socket.on("start_game", (roomId) => {
    try {
      const game = gameManager.getGame(roomId);

      if (!game) {
        throw new Error("Room not found");
      }

      const leader = game.getLeader();

      if (!leader || leader.id !== socket.id) {
        throw new Error("Only the leader can start the game");
      }

      game.start();

      io.to(roomId).emit("game_started");

      const firstPiece = game.getPiece(0);
      io.to(roomId).emit("new_piece", firstPiece);
    } catch (error) {
      socket.emit(
        "error_message",
        error instanceof Error ? error.message : "Unable to start game"
      );
    }
  });

  socket.on("update_spectrum", (spectrum: Spectrum) => {
    if (!currentRoomId) {
      return;
    }

    socket.to(currentRoomId).emit("spectrum_updated", {
      playerId: socket.id,
      spectrum,
    });
  });

  socket.on("lines_cleared", (count) => {
    if (!currentRoomId || count <= 1) {
      return;
    }

    socket.to(currentRoomId).emit("receive_penalty", count - 1);
  });

  socket.on("player_lost", () => {
    if (!currentRoomId) {
      return;
    }

    const game = gameManager.getGame(currentRoomId);

    if (!game) {
      return;
    }

    const winner = game.eliminatePlayer(socket.id);

    emitRoomUpdate(currentRoomId);

    if (winner) {
      io.to(currentRoomId).emit("game_over", winner.id);
    }
  });

  socket.on("request_next_piece", (pieceIndex: number) => {
    if (!currentRoomId) {
        return;
    }

    const game = gameManager.getGame(currentRoomId);

    if (!game || game.status !== "playing") {
        return;
    }

    const piece = game.getPiece(pieceIndex)
    socket.emit("new_piece", piece);
  });

    socket.on("restart_game", (roomId) => {
        try {
            const game = gameManager.getGame(roomId);

            if (!game) {
            throw new Error("Room not found");
            }

            const leader = game.getLeader();

            if (!leader || leader.id !== socket.id) {
            throw new Error("Only the leader can restart the game");
            }

            game.restart();

            io.to(roomId).emit("game_restarted");
            emitRoomUpdate(roomId);
        } catch (error) {
            socket.emit(
            "error_message",
            error instanceof Error ? error.message : "Unable to restart game"
            );
        }
    });

  socket.on("leave_room", () => {
    leaveCurrentRoom();
  });

  socket.on("disconnect", () => {
    leaveCurrentRoom();
  });
}