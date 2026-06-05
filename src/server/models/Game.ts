import { Player } from "./Player";
import { PieceGenerator } from "../services/PieceGenerator";
import type { PieceType, PlayerState } from "../../shared/types";

export type GameStatus = "waiting" | "playing" | "finished";

export class Game {
  public readonly roomId: string;
  public players: Player[];
  public status: GameStatus;
  private pieceGenerator: PieceGenerator;

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

    const isLeader = this.players.length === 0;
    const player = new Player(id, username, isLeader);

    this.players.push(player);
    return player;
  }

  public removePlayer(playerId: string): void {
    this.players = this.players.filter((player) => player.id !== playerId);

    if (this.players.length > 0 && !this.players.some((player) => player.isLeader)) {
      this.players[0]?.makeLeader();
    }
  }

  public start(): void {
    if (this.players.length === 0) {
      throw new Error("Cannot start an empty game");
    }

    this.status = "playing";
  }

  public restart(): void {
    this.status = "waiting";
    this.pieceGenerator = new PieceGenerator();

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