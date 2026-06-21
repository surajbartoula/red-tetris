import { describe, it, expect } from "vitest";
import { getShape, PIECE_SHAPES } from "../../src/client/game/pieces";

describe("PIECE_SHAPES", () => {
	it("defines all 7 tetrimino types", () => {
		const types = ["I", "J", "L", "O", "S", "T", "Z"];
		types.forEach((t) => expect(PIECE_SHAPES).toHaveProperty(t));
	});

	it("each piece has 4 rotations", () => {
		Object.values(PIECE_SHAPES).forEach((rotations) => {
			expect(rotations).toHaveLength(4);
		});
	});

	it("each rotation has 4 cells", () => {
		Object.values(PIECE_SHAPES).forEach((rotations) => {
			rotations.forEach((rotation) => {
				expect(rotation).toHaveLength(4);
			});
		});
	});
});

describe("getShape", () => {
	it("returns correct shape for rotation 0", () => {
		const shape = getShape("T", 0);
		expect(shape).toHaveLength(4);
	});

	it("wraps rotation above 3", () => {
		const shape0 = getShape("T", 0);
		const shape4 = getShape("T", 4);
		expect(shape0).toEqual(shape4);
	});

	it("returns different shapes for different rotations", () => {
		const shape0 = getShape("I", 0);
		const shape1 = getShape("I", 1);
		expect(shape0).not.toEqual(shape1);
	});

	it("O piece has same shape in all rotations", () => {
		const shape0 = getShape("O", 0);
		const shape1 = getShape("O", 1);
		const shape2 = getShape("O", 2);
		const shape3 = getShape("O", 3);
		expect(shape0).toEqual(shape1);
		expect(shape1).toEqual(shape2);
		expect(shape2).toEqual(shape3);
	});
});
