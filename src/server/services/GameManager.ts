import { Game } from "../models/Game";

export class GameManager {
	private games: Map<string, Game>;

	constructor() {
		this.games = new Map();
	}

	public getOrCreateGame(roomId: string): Game {
		let game = this.games.get(roomId);

		if (!game) {
			game = new Game(roomId);
			this.games.set(roomId, game);
		}

		return game;
	}

	public getGame(roomId: string): Game | undefined {
		return this.games.get(roomId);
	}

	public removeGame(roomId: string): void {
		this.games.delete(roomId);
	}

	public removeEmptyGame(roomId: string): void {
		const game = this.games.get(roomId);

		if (game && game.players.length === 0) {
			this.games.delete(roomId);
		}
	}
}

export const gameManager = new GameManager();
