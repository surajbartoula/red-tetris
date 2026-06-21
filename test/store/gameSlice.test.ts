import { describe, it, expect } from "vitest";
import gameReducer, {
	startGame,
	moveLeft,
	moveRight,
	rotate,
	softDrop,
	hardDrop,
	addPenalty,
	setWinner,
	resetGame,
	setNextPiece,
	lockPiece,
	tick,
} from "../../src/client/store/gameSlice";

const initialState = gameReducer(undefined, { type: "@@init" });

describe("gameSlice", () => {
	it("has correct initial state", () => {
		expect(initialState.status).toBe("idle");
		expect(initialState.activePiece).toBeNull();
		expect(initialState.board).toHaveLength(20);
	});

	it("startGame resets to playing", () => {
		const state = gameReducer(initialState, startGame());
		expect(state.status).toBe("playing");
		expect(state.pieceIndex).toBe(0);
	});

	it("setNextPiece spawns piece when none active", () => {
		const playing = gameReducer(initialState, startGame());
		const state = gameReducer(playing, setNextPiece("T"));
		expect(state.activePiece).not.toBeNull();
		expect(state.activePiece?.type).toBe("T");
	});

	it("moveLeft moves piece left", () => {
		let state = gameReducer(initialState, startGame());
		state = gameReducer(state, setNextPiece("T"));
		const before = state.activePiece!.x;
		state = gameReducer(state, moveLeft());
		expect(state.activePiece!.x).toBe(before - 1);
	});

	it("moveRight moves piece right", () => {
		let state = gameReducer(initialState, startGame());
		state = gameReducer(state, setNextPiece("T"));
		const before = state.activePiece!.x;
		state = gameReducer(state, moveRight());
		expect(state.activePiece!.x).toBe(before + 1);
	});

	it("rotate changes rotation", () => {
		let state = gameReducer(initialState, startGame());
		state = gameReducer(state, setNextPiece("T"));
		const before = state.activePiece!.rotation;
		state = gameReducer(state, rotate());
		expect(state.activePiece!.rotation).toBe((before + 1) % 4);
	});

	it("softDrop moves piece down", () => {
		let state = gameReducer(initialState, startGame());
		state = gameReducer(state, setNextPiece("T"));
		const before = state.activePiece!.y;
		state = gameReducer(state, softDrop());
		expect(state.activePiece!.y).toBe(before + 1);
	});

	it("hardDrop moves piece to bottom", () => {
		let state = gameReducer(initialState, startGame());
		state = gameReducer(state, setNextPiece("T"));
		state = gameReducer(state, hardDrop());
		expect(state.activePiece!.y).toBeGreaterThan(5);
	});

	it("addPenalty accumulates", () => {
		let state = gameReducer(initialState, addPenalty(2));
		state = gameReducer(state, addPenalty(3));
		expect(state.pendingPenalty).toBe(5);
	});

	it("setWinner sets winnerId and status", () => {
		const state = gameReducer(initialState, setWinner("player1"));
		expect(state.winnerId).toBe("player1");
		expect(state.status).toBe("won");
	});

	it("resetGame returns to initial state", () => {
		let state = gameReducer(initialState, startGame());
		state = gameReducer(state, resetGame());
		expect(state.status).toBe("idle");
		expect(state.activePiece).toBeNull();
	});

	it("moveLeft does nothing without active piece", () => {
		const state = gameReducer(initialState, moveLeft());
		expect(state.activePiece).toBeNull();
	});

	it("tick does nothing when not playing", () => {
		const state = gameReducer(initialState, tick());
		expect(state.activePiece).toBeNull();
	});

	it("lockPiece does nothing without active piece", () => {
		const playing = gameReducer(initialState, startGame());
		const state = gameReducer(playing, lockPiece());
		expect(state.activePiece).toBeNull();
	});
});
