import { describe, it, expect } from "vitest";
import gameReducer, {
	startGame,
	setNextPiece,
	lockPiece,
	tick,
	moveLeft,
	moveRight,
	rotate,
	softDrop,
	hardDrop,
	addPenalty,
	updateSpectrum,
	removeSpectrum,
} from "../../src/client/store/gameSlice";

const initialState = gameReducer(undefined, { type: "@@init" });

const playingWithPiece = () => {
	let state = gameReducer(initialState, startGame());
	state = gameReducer(state, setNextPiece("T"));
	return state;
};

it("lockPiece clears completed lines", () => {
	let state = gameReducer(initialState, startGame());
	state = gameReducer(state, setNextPiece("O"));
	// Deep clone board before mutating (Immer freezes state)
	const board = state.board.map((row) => [...row]);
	for (let r = 10; r < 20; r++) {
		board[r] = Array(10).fill("T");
	}
	// Feed the modified board through a action that replaces state
	state = { ...state, board };
	state = gameReducer(state, hardDrop());
	state = gameReducer(state, lockPiece());
	expect(state.board).toHaveLength(20);
});

it("setNextPiece sets status to lost when spawn blocked", () => {
	let state = gameReducer(initialState, startGame());
	// Deep clone before mutating
	const board = state.board.map((row) => [...row]);
	for (let r = 0; r < 3; r++) {
		board[r] = Array(10).fill("T");
	}
	state = { ...state, board };
	state = gameReducer(state, setNextPiece("T"));
	expect(state.status).toBe("lost");
});
