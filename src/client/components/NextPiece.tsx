import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { PIECE_COLORS } from "../game/constants";
import { getShape } from "../game/pieces";

export const NextPiece = () => {
	const nextPiece = useSelector((s: RootState) => s.game.nextPieceType);

	if (!nextPiece) return null;

	const shape = getShape(nextPiece, 0);
	const color = PIECE_COLORS[nextPiece] ?? "white";

	// Normalize to 4x4 grid
	const grid = Array.from({ length: 4 }, (_, r) =>
		Array.from({ length: 4 }, (_, c) => shape.some(([sr, sc]) => sr === r && sc === c))
	);

	return (
		<div>
			<div
				style={{
					fontSize: 12,
					color: "#888",
					marginBottom: 6,
					textTransform: "uppercase",
					letterSpacing: 2,
				}}
			>
				Next
			</div>
			<div style={{ display: "grid", gridTemplateColumns: "repeat(4, 20px)", gap: 1 }}>
				{grid.map((row, r) =>
					row.map((filled, c) => (
						<div
							key={`${r}-${c}`}
							style={{
								width: 20,
								height: 20,
								backgroundColor: filled ? color : "transparent",
								border: "1px solid #1a1a1a",
							}}
						/>
					))
				)}
			</div>
		</div>
	);
};
