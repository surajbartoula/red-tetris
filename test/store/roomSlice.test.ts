import { describe, it, expect } from "vitest";
import roomReducer, {
	setRoom,
	setPlayers,
	setError,
	clearError,
	resetRoom,
	setPending,
} from "../../src/client/store/roomSlice";

const initialState = roomReducer(undefined, { type: "@@init" });

describe("roomSlice", () => {
	it("has correct initial state", () => {
		expect(initialState.roomId).toBeNull();
		expect(initialState.myId).toBeNull();
		expect(initialState.players).toHaveLength(0);
		expect(initialState.error).toBeNull();
	});

	it("setRoom updates roomId and myId", () => {
		const state = roomReducer(initialState, setRoom({ roomId: "room1", myId: "abc" }));
		expect(state.roomId).toBe("room1");
		expect(state.myId).toBe("abc");
		expect(state.error).toBeNull();
	});

	it("setPlayers updates players array", () => {
		const players = [{ id: "1", username: "alice", isLeader: true, alive: true }];
		const state = roomReducer(initialState, setPlayers(players));
		expect(state.players).toHaveLength(1);
		expect(state.players[0]?.username).toBe("alice");
	});

	it("setError stores error message", () => {
		const state = roomReducer(initialState, setError("Something went wrong"));
		expect(state.error).toBe("Something went wrong");
	});

	it("clearError removes error", () => {
		let state = roomReducer(initialState, setError("error"));
		state = roomReducer(state, clearError());
		expect(state.error).toBeNull();
	});

	it("resetRoom returns to initial state", () => {
		let state = roomReducer(initialState, setRoom({ roomId: "r1", myId: "id1" }));
		state = roomReducer(state, resetRoom());
		expect(state.roomId).toBeNull();
		expect(state.myId).toBeNull();
	});

	it("setPending stores pending room and username", () => {
		const state = roomReducer(initialState, setPending({ roomId: "room1", username: "alice" }));
		expect(state.pendingRoom).toBe("room1");
		expect(state.pendingUsername).toBe("alice");
	});
});
