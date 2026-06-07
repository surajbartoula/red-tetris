import type { PieceType } from "../../shared/types";

export class PieceGenerator {
	private readonly pieces: PieceType[] = ["I", "J", "L", "O", "S", "T", "Z"];
	private queue: PieceType[] = [];

	public getNextPiece(): PieceType {
		if (this.queue.length === 0) {
			this.queue = this.generateBag();
		}

		return this.queue.shift() as PieceType;
	}

	private generateBag(): PieceType[] {
		const bag = [...this.pieces];

		for (let i = bag.length - 1; i > 0; i--) {
			const randomIndex = Math.floor(Math.random() * (i + 1));
			const temp = bag[i] as PieceType;
			bag[i] = bag[randomIndex] as PieceType;
			bag[randomIndex] = temp;
		}

		return bag;
	}
}
