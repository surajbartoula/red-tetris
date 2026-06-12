import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { PieceType, Spectrum } from "../../shared/types";
import {
	createBoard,
	mergePiece,
	clearLines,
	addPenaltyLines,
	isValidPosition,
	spawnPiece,
	type Board,
	type ActivePiece,
} from "../game/board";

interface OpponentSpectrum {
	playerId: string;
	spectrum: Spectrum;
}

export interface GameState {
	status: "idle" | "playing" | "lost" | "won";
	board: Board;
	activePiece: ActivePiece | null;
	nextPieceType: PieceType | null;
	pieceIndex: number;
	opponentSpectrums: OpponentSpectrum[];
	winnerId: string | null;
	pendingPenalty: number;
}

const initialState: GameState = {
	status: "idle",
	board: createBoard(),
	activePiece: null,
	nextPieceType: null,
	pieceIndex: 0,
	opponentSpectrums: [],
	winnerId: null,
	pendingPenalty: 0,
};

const gameSlice = createSlice({
	name: "game",
	initialState,
	reducers: {
		startGame(state) {
			state.status = "playing";
			state.board = createBoard();
			state.activePiece = null;
			state.nextPieceType = null;
			state.pieceIndex = 0;
			state.opponentSpectrums = [];
			state.winnerId = null;
			state.pendingPenalty = 0;
		},

		spawnNewPiece(state, action: PayloadAction<PieceType>) {
			const piece = spawnPiece(action.payload);
			if (!isValidPosition(state.board, piece)) {
				state.status = "lost";
				state.activePiece = null;
			} else {
				state.activePiece = piece;
				state.pieceIndex += 1;
			}
		},

		setNextPiece(state, action: PayloadAction<PieceType>) {
			if (state.activePiece === null) {
				// First piece or just locked — spawn immediately
				const piece = spawnPiece(action.payload);
				if (!isValidPosition(state.board, piece)) {
					state.status = "lost";
				} else {
					state.activePiece = piece;
					state.pieceIndex += 1;
				}
			} else {
				state.nextPieceType = action.payload;
			}
		},

		moveLeft(state) {
			if (!state.activePiece) return;
			const moved = { ...state.activePiece, x: state.activePiece.x - 1 };
			if (isValidPosition(state.board, moved)) state.activePiece = moved;
		},

		moveRight(state) {
			if (!state.activePiece) return;
			const moved = { ...state.activePiece, x: state.activePiece.x + 1 };
			if (isValidPosition(state.board, moved)) state.activePiece = moved;
		},

		rotate(state) {
			if (!state.activePiece) return;
			const rotated = {
				...state.activePiece,
				rotation: (state.activePiece.rotation + 1) % 4,
			};
			if (isValidPosition(state.board, rotated)) state.activePiece = rotated;
		},

		softDrop(state) {
			if (!state.activePiece) return;
			const dropped = { ...state.activePiece, y: state.activePiece.y + 1 };
			if (isValidPosition(state.board, dropped)) state.activePiece = dropped;
		},

		hardDrop(state) {
			if (!state.activePiece) return;
			let piece = { ...state.activePiece };
			while (isValidPosition(state.board, { ...piece, y: piece.y + 1 })) {
				piece = { ...piece, y: piece.y + 1 };
			}
			state.activePiece = piece;
		},

		// Returns linesCleared count via selector after this action
		lockPiece(state): void {
			if (!state.activePiece) return;
			const merged = mergePiece(state.board, state.activePiece);
			const { board: cleared, linesCleared } = clearLines(merged);

			// Apply any pending penalty AFTER clearing
			const finalBoard =
				state.pendingPenalty > 0 ? addPenaltyLines(cleared, state.pendingPenalty) : cleared;

			state.board = finalBoard;
			state.pendingPenalty = 0;
			state.activePiece = null;

			// Store lines cleared temporarily for the hook to read
			(state as GameState & { _lastLinesCleared: number })._lastLinesCleared = linesCleared;

			// Spawn next piece if available
			if (state.nextPieceType) {
				const next = spawnPiece(state.nextPieceType);
				if (!isValidPosition(state.board, next)) {
					state.status = "lost";
				} else {
					state.activePiece = next;
					state.nextPieceType = null;
					state.pieceIndex += 1;
				}
			}
		},

		tick(state) {
			if (!state.activePiece || state.status !== "playing") return;
			const dropped = { ...state.activePiece, y: state.activePiece.y + 1 };
			if (isValidPosition(state.board, dropped)) {
				state.activePiece = dropped;
			}
			// If can't drop, lockPiece should be called by the game loop
		},

		addPenalty(state, action: PayloadAction<number>) {
			state.pendingPenalty += action.payload;
		},

		updateSpectrum(state, action: PayloadAction<OpponentSpectrum>) {
			const idx = state.opponentSpectrums.findIndex(
				(s) => s.playerId === action.payload.playerId
			);
			if (idx >= 0) {
				state.opponentSpectrums[idx] = action.payload;
			} else {
				state.opponentSpectrums.push(action.payload);
			}
		},

		removeSpectrum(state, action: PayloadAction<string>) {
			state.opponentSpectrums = state.opponentSpectrums.filter(
				(s) => s.playerId !== action.payload
			);
		},

		setWinner(state, action: PayloadAction<string>) {
			state.winnerId = action.payload;
			state.status = "won";
		},

		resetGame() {
			return initialState;
		},
	},
});

export const {
	startGame,
	spawnNewPiece,
	setNextPiece,
	moveLeft,
	moveRight,
	rotate,
	softDrop,
	hardDrop,
	lockPiece,
	tick,
	addPenalty,
	updateSpectrum,
	removeSpectrum,
	setWinner,
	resetGame,
} = gameSlice.actions;

export default gameSlice.reducer;
