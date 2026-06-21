import { describe, it, expect, beforeEach } from "vitest";
import { GameManager } from "../../src/server/services/GameManager";

describe("GameManager", () => {
	let manager: GameManager;

	beforeEach(() => {
		manager = new GameManager();
	});

	it("creates a new game if none exists", () => {
		const game = manager.getOrCreateGame("room1");
		expect(game).toBeDefined();
		expect(game.roomId).toBe("room1");
	});

	it("returns same game on second call", () => {
		const g1 = manager.getOrCreateGame("room1");
		const g2 = manager.getOrCreateGame("room1");
		expect(g1).toBe(g2);
	});

	it("getGame returns undefined for unknown room", () => {
		expect(manager.getGame("unknown")).toBeUndefined();
	});

	it("getGame returns game after creation", () => {
		manager.getOrCreateGame("room1");
		expect(manager.getGame("room1")).toBeDefined();
	});

	it("removeGame deletes the game", () => {
		manager.getOrCreateGame("room1");
		manager.removeGame("room1");
		expect(manager.getGame("room1")).toBeUndefined();
	});

	it("removeEmptyGame removes game with no players", () => {
		manager.getOrCreateGame("room1");
		manager.removeEmptyGame("room1");
		expect(manager.getGame("room1")).toBeUndefined();
	});

	it("removeEmptyGame keeps game with players", () => {
		const game = manager.getOrCreateGame("room1");
		game.addPlayer("id1", "alice");
		manager.removeEmptyGame("room1");
		expect(manager.getGame("room1")).toBeDefined();
	});

	it("removeEmptyGame does nothing for unknown room", () => {
		expect(() => manager.removeEmptyGame("unknown")).not.toThrow();
	});

	it("supports multiple concurrent games", () => {
		manager.getOrCreateGame("room1");
		manager.getOrCreateGame("room2");
		expect(manager.getGame("room1")).toBeDefined();
		expect(manager.getGame("room2")).toBeDefined();
	});
});
