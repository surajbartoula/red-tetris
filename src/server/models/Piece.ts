import type { PieceType } from "../../shared/types";

export interface PiecePosition {
	x: number;
	y: number;
}

export class Piece {
	public readonly type: PieceType;
	public rotation: number;
	public position: PiecePosition;

	constructor(type: PieceType, x = 4, y = 0) {
		this.type = type;
		this.rotation = 0;
		this.position = { x, y };
	}

	public rotate(): void {
		this.rotation = (this.rotation + 1) % 4;
	}

	public moveLeft(): void {
		this.position.x -= 1;
	}

	public moveRight(): void {
		this.position.x += 1;
	}

	public moveDown(): void {
		this.position.y += 1;
	}
}
