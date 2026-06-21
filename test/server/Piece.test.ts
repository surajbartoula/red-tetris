import { describe, it, expect } from "vitest";
import { Piece } from "../../src/server/models/Piece";

describe("Piece", () => {
	it("creates piece with default position", () => {
		const piece = new Piece("T");
		expect(piece.type).toBe("T");
		expect(piece.rotation).toBe(0);
		expect(piece.position.x).toBe(4);
		expect(piece.position.y).toBe(0);
	});

	it("creates piece with custom position", () => {
		const piece = new Piece("I", 2, 5);
		expect(piece.position.x).toBe(2);
		expect(piece.position.y).toBe(5);
	});

	it("rotate increments rotation", () => {
		const piece = new Piece("T");
		piece.rotate();
		expect(piece.rotation).toBe(1);
	});

	it("rotate wraps at 4", () => {
		const piece = new Piece("T");
		piece.rotate();
		piece.rotate();
		piece.rotate();
		piece.rotate();
		expect(piece.rotation).toBe(0);
	});

	it("moveLeft decrements x", () => {
		const piece = new Piece("T");
		piece.moveLeft();
		expect(piece.position.x).toBe(3);
	});

	it("moveRight increments x", () => {
		const piece = new Piece("T");
		piece.moveRight();
		expect(piece.position.x).toBe(5);
	});

	it("moveDown increments y", () => {
		const piece = new Piece("T");
		piece.moveDown();
		expect(piece.position.y).toBe(1);
	});
});
