import { describe, it, expect } from "vitest";
import { getSpectrum } from "../../src/client/game/spectrum";
import { createBoard } from "../../src/client/game/board";

describe("getSpectrum", () => {
	it("returns 10 zeros for empty board", () => {
		const board = createBoard();
		expect(getSpectrum(board)).toHaveLength(10);
		expect(getSpectrum(board).every((h) => h === 0)).toBe(true);
	});

	it("returns correct height for filled cell", () => {
		const board = createBoard();
		board[19]![0] = "T";
		expect(getSpectrum(board)[0]).toBe(1);
	});
});
