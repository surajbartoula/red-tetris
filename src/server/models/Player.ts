import type { PlayerState } from "../../shared/types";

export class Player {
  public readonly id: string;
  public readonly username: string;
  public isLeader: boolean;
  public alive: boolean;

  constructor(id: string, username: string, isLeader = false) {
    this.id = id;
    this.username = username;
    this.isLeader = isLeader;
    this.alive = true;
  }

  public eliminate(): void {
    this.alive = false;
  }

  public makeLeader(): void {
    this.isLeader = true;
  }

  public removeLeader(): void {
    this.isLeader = false;
  }

  public toState(): PlayerState {
    return {
      id: this.id,
      username: this.username,
      isLeader: this.isLeader,
      alive: this.alive,
    };
  }
}