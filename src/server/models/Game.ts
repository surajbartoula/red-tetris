import { Player } from "./Player";
import { PieceGenerator } from "../services/PieceGenerator";
import type { PieceType, PlayerState } from "../../shared/types";

export type GameStatus = "waiting" | "playing" | "finished";

export class Game {
  public readonly roomId: string;
  public players: Player[];
  public status: GameStatus;
  private pieceGenerator: PieceGenerator;
  private pieceSequence: PieceType[] = [];
  private currentPieceIndex = 0;
  
  constructor(roomId: string) {
    this.roomId = roomId;
    this.players = [];
    this.status = "waiting";
    this.pieceGenerator = new PieceGenerator();
  }

  public addPlayer(id: string, username: string): Player {
    if (this.status === "playing") {
      throw new Error("Cannot join a game that has already started");
    }
    if (
        this.players.some(
        (player) => player.username.toLowerCase() === username.toLowerCase()
        )
    ) {
        throw new Error("Username already taken in this room");
    }

    const isLeader = this.players.length === 0;
    const player = new Player(id, username, isLeader);

    this.players.push(player);
    return player;
  }

  public removePlayer(playerId: string): Player | null {
    const removedPlayer = this.players.find((player) => player.id === playerId);

    this.players = this.players.filter((player) => player.id !== playerId);

    if (!removedPlayer) {
        return null;
    }

    if (this.players.length > 0 && !this.players.some((player) => player.isLeader)) {
        this.players[0]?.makeLeader();
        return this.players[0] ?? null;
    }

    return null;
    }

    public getPiece(index: number): PieceType {
        while (index >= this.pieceSequence.length) {
            this.pieceSequence.push(
            this.pieceGenerator.getNextPiece()
            );
        }

        return this.pieceSequence[index]!;
    }

  public start(): void {
    if (this.status === "playing") {
        throw new Error("Game already started");
    }

    if (this.players.length === 0) {
        throw new Error("Cannot start an empty game");
    }

    this.status = "playing";
  }

  public restart(): void {
    this.status = "waiting";

    this.pieceGenerator = new PieceGenerator();
    this.pieceSequence = [];

    this.players.forEach((player, index) => {
      player.alive = true;
      player.isLeader = index === 0;
    });
  }

  public getNextPiece(): PieceType {
    return this.pieceGenerator.getNextPiece();
  }

  public eliminatePlayer(playerId: string): Player | null {
    const player = this.players.find((currentPlayer) => currentPlayer.id === playerId);

    if (!player) {
      return null;
    }

    player.eliminate();

    const alivePlayers = this.players.filter((currentPlayer) => currentPlayer.alive);

    if (alivePlayers.length <= 1) {
      this.status = "finished";
      return alivePlayers[0] ?? null;
    }

    return null;
  }

  public getPlayersState(): PlayerState[] {
    return this.players.map((player) => player.toState());
  }

  public getLeader(): Player | undefined {
    return this.players.find((player) => player.isLeader);
  }
}