import { describe, it, expect } from "vitest";
import { PieceGenerator } from "../../src/server/services/PieceGenerator";

const VALID_PIECES = ["I", "J", "L", "O", "S", "T", "Z"];

describe("PieceGenerator", () => {
	it("returns valid piece types", () => {
		const gen = new PieceGenerator();
		for (let i = 0; i < 14; i++) {
			expect(VALID_PIECES).toContain(gen.getNextPiece());
		}
	});

	it("generates all 7 pieces within first 7", () => {
		const gen = new PieceGenerator();
		const pieces = Array.from({ length: 7 }, () => gen.getNextPiece());
		const unique = new Set(pieces);
		expect(unique.size).toBe(7);
	});

	it("generates all 7 pieces in second bag too", () => {
		const gen = new PieceGenerator();
		Array.from({ length: 7 }, () => gen.getNextPiece());
		const pieces = Array.from({ length: 7 }, () => gen.getNextPiece());
		const unique = new Set(pieces);
		expect(unique.size).toBe(7);
	});

	it("different instances can produce different orders", () => {
		const results: string[][] = [];
		for (let i = 0; i < 5; i++) {
			const gen = new PieceGenerator();
			results.push(Array.from({ length: 7 }, () => gen.getNextPiece()));
		}
		const allSame = results.every((r) => JSON.stringify(r) === JSON.stringify(results[0]));
		expect(allSame).toBe(false);
	});
});
