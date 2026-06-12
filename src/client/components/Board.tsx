import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { getGhostPiece, getCells } from "../game/board";
import { PIECE_COLORS, BOARD_WIDTH, BOARD_HEIGHT } from "../game/constants";

export const Board = () => {
	const board = useSelector((s: RootState) => s.game.board);
	const activePiece = useSelector((s: RootState) => s.game.activePiece);

	const ghostCells = activePiece ? getCells(getGhostPiece(board, activePiece)) : [];
	const activeCells = activePiece ? getCells(activePiece) : [];

	const getColor = (r: number, c: number): string => {
		const isActive = activeCells.some((cell) => cell.r === r && cell.c === c);
		const isGhost = ghostCells.some((cell) => cell.r === r && cell.c === c);

		if (isActive && activePiece) return PIECE_COLORS[activePiece.type] ?? "white";
		if (isGhost) return PIECE_COLORS["GHOST"]!;
		const cell = board[r]![c];
		if (cell) return PIECE_COLORS[cell] ?? "#888";
		return "transparent";
	};

	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: `repeat(${BOARD_WIDTH}, 28px)`,
				gridTemplateRows: `repeat(${BOARD_HEIGHT}, 28px)`,
				border: "2px solid #444",
				gap: "1px",
				backgroundColor: "#111",
				padding: "2px",
			}}
		>
			{Array.from({ length: BOARD_HEIGHT }, (_, r) =>
				Array.from({ length: BOARD_WIDTH }, (_, c) => (
					<div
						key={`${r}-${c}`}
						style={{
							width: 28,
							height: 28,
							backgroundColor: getColor(r, c),
							border:
								board[r]![c] ||
								activeCells.some((cell) => cell.r === r && cell.c === c)
									? "1px solid rgba(255,255,255,0.1)"
									: "1px solid #1a1a1a",
							boxSizing: "border-box",
						}}
					/>
				))
			)}
		</div>
	);
};
