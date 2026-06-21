import { describe, it, expect } from "vitest";
import { Player } from "../../src/server/models/Player";

describe("Player", () => {
	it("creates player with correct properties", () => {
		const player = new Player("id1", "alice", true);
		expect(player.id).toBe("id1");
		expect(player.username).toBe("alice");
		expect(player.isLeader).toBe(true);
		expect(player.alive).toBe(true);
	});

	it("defaults isLeader to false", () => {
		const player = new Player("id1", "alice");
		expect(player.isLeader).toBe(false);
	});

	it("eliminate sets alive to false", () => {
		const player = new Player("id1", "alice");
		player.eliminate();
		expect(player.alive).toBe(false);
	});

	it("makeLeader sets isLeader to true", () => {
		const player = new Player("id1", "alice");
		player.makeLeader();
		expect(player.isLeader).toBe(true);
	});

	it("removeLeader sets isLeader to false", () => {
		const player = new Player("id1", "alice", true);
		player.removeLeader();
		expect(player.isLeader).toBe(false);
	});

	it("toState returns correct shape", () => {
		const player = new Player("id1", "alice", true);
		const state = player.toState();
		expect(state).toEqual({
			id: "id1",
			username: "alice",
			isLeader: true,
			alive: true,
		});
	});
});
