import { describe, it, expect, beforeEach } from "vitest";
import { Game } from "../../src/server/models/Game";

describe("Game", () => {
	let game: Game;

	beforeEach(() => {
		game = new Game("test-room");
	});

	it("initializes with waiting status", () => {
		expect(game.status).toBe("waiting");
	});

	it("initializes with empty players", () => {
		expect(game.players).toHaveLength(0);
	});

	describe("addPlayer", () => {
		it("adds a player", () => {
			game.addPlayer("id1", "alice");
			expect(game.players).toHaveLength(1);
		});

		it("first player becomes leader", () => {
			const player = game.addPlayer("id1", "alice");
			expect(player.isLeader).toBe(true);
		});

		it("second player is not leader", () => {
			game.addPlayer("id1", "alice");
			const player = game.addPlayer("id2", "bob");
			expect(player.isLeader).toBe(false);
		});

		it("throws if username taken (case insensitive)", () => {
			game.addPlayer("id1", "Alice");
			expect(() => game.addPlayer("id2", "alice")).toThrow("Username already taken");
		});

		it("throws if game already started", () => {
			game.addPlayer("id1", "alice");
			game.start();
			expect(() => game.addPlayer("id2", "bob")).toThrow("already started");
		});
	});

	describe("removePlayer", () => {
		it("removes player from list", () => {
			game.addPlayer("id1", "alice");
			game.removePlayer("id1");
			expect(game.players).toHaveLength(0);
		});

		it("returns null for unknown player", () => {
			const result = game.removePlayer("unknown");
			expect(result).toBeNull();
		});

		it("transfers leadership when leader leaves", () => {
			game.addPlayer("id1", "alice");
			game.addPlayer("id2", "bob");
			game.removePlayer("id1");
			expect(game.players[0]?.isLeader).toBe(true);
		});

		it("returns null when non-leader leaves", () => {
			game.addPlayer("id1", "alice");
			game.addPlayer("id2", "bob");
			const result = game.removePlayer("id2");
			expect(result).toBeNull();
		});
	});

	describe("start", () => {
		it("sets status to playing", () => {
			game.addPlayer("id1", "alice");
			game.start();
			expect(game.status).toBe("playing");
		});

		it("throws if already playing", () => {
			game.addPlayer("id1", "alice");
			game.start();
			expect(() => game.start()).toThrow("already started");
		});

		it("throws if no players", () => {
			expect(() => game.start()).toThrow("empty game");
		});
	});

	describe("getPiece", () => {
		it("returns a valid piece type", () => {
			const piece = game.getPiece(0);
			expect(["I", "J", "L", "O", "S", "T", "Z"]).toContain(piece);
		});

		it("returns same piece for same index", () => {
			const p1 = game.getPiece(0);
			const p2 = game.getPiece(0);
			expect(p1).toBe(p2);
		});

		it("generates pieces beyond initial sequence", () => {
			for (let i = 0; i < 20; i++) {
				const piece = game.getPiece(i);
				expect(["I", "J", "L", "O", "S", "T", "Z"]).toContain(piece);
			}
		});
	});

	describe("eliminatePlayer", () => {
		it("returns null for unknown player", () => {
			const result = game.eliminatePlayer("unknown");
			expect(result).toBeNull();
		});

		it("sets player alive to false", () => {
			game.addPlayer("id1", "alice");
			game.addPlayer("id2", "bob");
			game.start();
			game.eliminatePlayer("id1");
			expect(game.players.find((p) => p.id === "id1")?.alive).toBe(false);
		});

		it("returns winner when one player remains", () => {
			game.addPlayer("id1", "alice");
			game.addPlayer("id2", "bob");
			game.start();
			const winner = game.eliminatePlayer("id1");
			expect(winner?.id).toBe("id2");
		});

		it("sets status to finished when one player remains", () => {
			game.addPlayer("id1", "alice");
			game.addPlayer("id2", "bob");
			game.start();
			game.eliminatePlayer("id1");
			expect(game.status).toBe("finished");
		});
	});

	describe("restart", () => {
		it("resets status to waiting", () => {
			game.addPlayer("id1", "alice");
			game.start();
			game.restart();
			expect(game.status).toBe("waiting");
		});

		it("resets all players to alive", () => {
			game.addPlayer("id1", "alice");
			game.addPlayer("id2", "bob");
			game.start();
			game.eliminatePlayer("id1");
			game.restart();
			expect(game.players.every((p) => p.alive)).toBe(true);
		});
	});

	describe("getPlayersState", () => {
		it("returns state for all players", () => {
			game.addPlayer("id1", "alice");
			game.addPlayer("id2", "bob");
			const state = game.getPlayersState();
			expect(state).toHaveLength(2);
		});
	});

	describe("getLeader", () => {
		it("returns the leader", () => {
			game.addPlayer("id1", "alice");
			const leader = game.getLeader();
			expect(leader?.id).toBe("id1");
		});

		it("returns undefined when no players", () => {
			expect(game.getLeader()).toBeUndefined();
		});
	});
});
