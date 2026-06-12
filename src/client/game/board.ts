import { BOARD_WIDTH, BOARD_HEIGHT } from "./constants";
import { getShape } from "./pieces";
import type { PieceType } from "../../shared/types";

export type Cell = string | null; // null = empty, string = color/type
export type Board = Cell[][];

export const createBoard = (): Board =>
	Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null));

export const createPenaltyLine = (): Cell[] => {
	const line: Cell[] = Array(BOARD_WIDTH).fill("PENALTY");
	// leave one random gap so the penalty line isn't immediately unbeatable
	line[Math.floor(Math.random() * BOARD_WIDTH)] = null;
	return line;
};

export interface ActivePiece {
	type: PieceType;
	rotation: number;
	x: number;
	y: number;
}

export const getCells = (piece: ActivePiece): Array<{ r: number; c: number }> =>
	getShape(piece.type, piece.rotation).map(([dr, dc]) => ({
		r: piece.y + dr!,
		c: piece.x + dc!,
	}));

export const isValidPosition = (board: Board, piece: ActivePiece): boolean =>
	getCells(piece).every(
		({ r, c }) =>
			r >= 0 && r < BOARD_HEIGHT && c >= 0 && c < BOARD_WIDTH && board[r]![c] === null
	);

export const mergePiece = (board: Board, piece: ActivePiece): Board => {
	const next = board.map((row) => [...row]);
	getCells(piece).forEach(({ r, c }) => {
		next[r]![c] = piece.type;
	});
	return next;
};

export const clearLines = (board: Board): { board: Board; linesCleared: number } => {
	const remaining = board.filter((row) => row.some((cell) => cell === null));
	const linesCleared = BOARD_HEIGHT - remaining.length;
	const empty = Array.from({ length: linesCleared }, () => Array(BOARD_WIDTH).fill(null));
	return { board: [...empty, ...remaining] as Board, linesCleared };
};

export const addPenaltyLines = (board: Board, count: number): Board => {
	const next = board.slice(count); // remove top N rows
	const penalties = Array.from({ length: count }, createPenaltyLine);
	return [...next, ...penalties] as Board;
};

export const computeSpectrum = (board: Board): number[] =>
	Array.from({ length: BOARD_WIDTH }, (_, c) => {
		for (let r = 0; r < BOARD_HEIGHT; r++) {
			if (board[r]![c] !== null) return BOARD_HEIGHT - r;
		}
		return 0;
	});

export const getGhostPiece = (board: Board, piece: ActivePiece): ActivePiece => {
	let ghost = { ...piece };
	while (isValidPosition(board, { ...ghost, y: ghost.y + 1 })) {
		ghost = { ...ghost, y: ghost.y + 1 };
	}
	return ghost;
};

export const spawnPiece = (type: PieceType): ActivePiece => ({
	type,
	rotation: 0,
	x: 3,
	y: 0,
});
