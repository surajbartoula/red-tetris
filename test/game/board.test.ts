import { describe, it, expect } from "vitest";
import {
	createBoard,
	mergePiece,
	clearLines,
	addPenaltyLines,
	computeSpectrum,
	isValidPosition,
	getGhostPiece,
	spawnPiece,
	createPenaltyLine,
	getCells,
} from "../../src/client/game/board";

describe("createBoard", () => {
	it("creates a 20x10 empty board", () => {
		const board = createBoard();
		expect(board).toHaveLength(20);
		expect(board[0]).toHaveLength(10);
	});

	it("fills board with null", () => {
		const board = createBoard();
		expect(board.every((row) => row.every((cell) => cell === null))).toBe(true);
	});
});

describe("spawnPiece", () => {
	it("spawns at x=3, y=0", () => {
		const piece = spawnPiece("I");
		expect(piece.x).toBe(3);
		expect(piece.y).toBe(0);
		expect(piece.rotation).toBe(0);
		expect(piece.type).toBe("I");
	});

	it("spawns all piece types", () => {
		const types = ["I", "J", "L", "O", "S", "T", "Z"] as const;
		types.forEach((type) => {
			const piece = spawnPiece(type);
			expect(piece.type).toBe(type);
		});
	});
});

describe("isValidPosition", () => {
	it("returns true for valid spawn position", () => {
		const board = createBoard();
		const piece = spawnPiece("T");
		expect(isValidPosition(board, piece)).toBe(true);
	});

	it("returns false when piece is out of bounds left", () => {
		const board = createBoard();
		const piece = { type: "T" as const, rotation: 0, x: -5, y: 0 };
		expect(isValidPosition(board, piece)).toBe(false);
	});

	it("returns false when piece is out of bounds right", () => {
		const board = createBoard();
		const piece = { type: "T" as const, rotation: 0, x: 15, y: 0 };
		expect(isValidPosition(board, piece)).toBe(false);
	});

	it("returns false when piece collides with existing block", () => {
		const board = createBoard();
		board[1]![4] = "T";
		const piece = { type: "T" as const, rotation: 0, x: 3, y: 0 };
		expect(isValidPosition(board, piece)).toBe(false);
	});

	it("returns false when piece is below board", () => {
		const board = createBoard();
		const piece = { type: "O" as const, rotation: 0, x: 0, y: 25 };
		expect(isValidPosition(board, piece)).toBe(false);
	});
});

describe("mergePiece", () => {
	it("merges piece into board without mutating original", () => {
		const board = createBoard();
		const piece = spawnPiece("O");
		const merged = mergePiece(board, piece);
		expect(merged).not.toBe(board);
		expect(board[0]!.every((c) => c === null)).toBe(true);
	});

	it("places piece cells on board", () => {
		const board = createBoard();
		const piece = { type: "O" as const, rotation: 0, x: 0, y: 0 };
		const merged = mergePiece(board, piece);
		const filled = merged.flat().filter((c) => c !== null);
		expect(filled.length).toBeGreaterThan(0);
	});
});

describe("clearLines", () => {
	it("returns same board when no lines complete", () => {
		const board = createBoard();
		const { board: cleared, linesCleared } = clearLines(board);
		expect(linesCleared).toBe(0);
		expect(cleared).toHaveLength(20);
	});

	it("clears a completed line", () => {
		const board = createBoard();
		board[19] = Array(10).fill("T");
		const { board: cleared, linesCleared } = clearLines(board);
		expect(linesCleared).toBe(1);
		expect(cleared[19]!.every((c) => c === null)).toBe(true);
	});

	it("clears multiple lines", () => {
		const board = createBoard();
		board[18] = Array(10).fill("I");
		board[19] = Array(10).fill("I");
		const { linesCleared } = clearLines(board);
		expect(linesCleared).toBe(2);
	});

	it("keeps board height at 20 after clearing", () => {
		const board = createBoard();
		board[19] = Array(10).fill("T");
		const { board: cleared } = clearLines(board);
		expect(cleared).toHaveLength(20);
	});
});

describe("addPenaltyLines", () => {
	it("adds penalty lines at the bottom", () => {
		const board = createBoard();
		const result = addPenaltyLines(board, 2);
		expect(result).toHaveLength(20);
		expect(result[19]!.filter((c) => c === "PENALTY").length).toBeGreaterThan(0);
	});

	it("keeps board height at 20", () => {
		const board = createBoard();
		const result = addPenaltyLines(board, 3);
		expect(result).toHaveLength(20);
	});
});

describe("computeSpectrum", () => {
	it("returns array of 10 zeros for empty board", () => {
		const board = createBoard();
		const spectrum = computeSpectrum(board);
		expect(spectrum).toHaveLength(10);
		expect(spectrum.every((h) => h === 0)).toBe(true);
	});

	it("returns correct height for filled column", () => {
		const board = createBoard();
		board[19]![0] = "T";
		const spectrum = computeSpectrum(board);
		expect(spectrum[0]).toBe(1);
	});

	it("returns 20 for fully filled column", () => {
		const board = createBoard();
		for (let r = 0; r < 20; r++) board[r]![0] = "T";
		const spectrum = computeSpectrum(board);
		expect(spectrum[0]).toBe(20);
	});
});

describe("getGhostPiece", () => {
	it("returns piece at bottom of empty board", () => {
		const board = createBoard();
		const piece = spawnPiece("I");
		const ghost = getGhostPiece(board, piece);
		expect(ghost.y).toBeGreaterThan(piece.y);
	});

	it("ghost piece is always lower than active piece", () => {
		const board = createBoard();
		const piece = spawnPiece("T");
		const ghost = getGhostPiece(board, piece);
		expect(ghost.y).toBeGreaterThanOrEqual(piece.y);
	});

	it("ghost stops above existing blocks", () => {
		const board = createBoard();
		board[10]![3] = "T";
		board[10]![4] = "T";
		board[10]![5] = "T";
		const piece = spawnPiece("T");
		const ghost = getGhostPiece(board, piece);
		expect(ghost.y).toBeLessThan(10);
	});
});

describe("getCells", () => {
	it("returns 4 cells for any piece", () => {
		const piece = spawnPiece("T");
		const cells = getCells(piece);
		expect(cells).toHaveLength(4);
	});

	it("cells include row and col", () => {
		const piece = spawnPiece("O");
		const cells = getCells(piece);
		cells.forEach((cell) => {
			expect(cell).toHaveProperty("r");
			expect(cell).toHaveProperty("c");
		});
	});
});

describe("createPenaltyLine", () => {
	it("creates a line of length 10", () => {
		const line = createPenaltyLine();
		expect(line).toHaveLength(10);
	});

	it("has exactly one gap (null)", () => {
		const line = createPenaltyLine();
		const nullCount = line.filter((c) => c === null).length;
		expect(nullCount).toBe(1);
	});

	it("fills rest with PENALTY", () => {
		const line = createPenaltyLine();
		const penaltyCount = line.filter((c) => c === "PENALTY").length;
		expect(penaltyCount).toBe(9);
	});
});
