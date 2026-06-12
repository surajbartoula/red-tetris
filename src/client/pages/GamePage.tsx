import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { Board } from "../components/Board";
import { NextPiece } from "../components/NextPiece";
import { Spectrum } from "../components/Spectrum";
import { GameOver } from "../components/GameOver";
import { useGameLoop } from "../hooks/useGameLoop";
import { useKeyboard } from "../hooks/useKeyboard";

export const GamePage = () => {
	useGameLoop();
	useKeyboard();

	const opponentSpectrums = useSelector((s: RootState) => s.game.opponentSpectrums);
	const players = useSelector((s: RootState) => s.room.players);
	const myId = useSelector((s: RootState) => s.room.myId);

	const opponents = opponentSpectrums.map((os) => ({
		...os,
		username: players.find((p) => p.id === os.playerId)?.username ?? os.playerId,
		alive: players.find((p) => p.id === os.playerId)?.alive ?? true,
	}));

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#0d0d0d",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				gap: 40,
				fontFamily: "monospace",
			}}
		>
			{/* Left sidebar: opponents spectrums */}
			<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
				{opponents.map((o) => (
					<Spectrum key={o.playerId} {...o} />
				))}
			</div>

			{/* Main board */}
			<div
				style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}
			>
				<div style={{ color: "#f00000", fontSize: 24, letterSpacing: 4 }}>RED TETRIS</div>
				<Board />
				<div style={{ color: "#444", fontSize: 11 }}>
					← → move · ↑ rotate · ↓ soft drop · SPACE hard drop
				</div>
			</div>

			{/* Right sidebar: next piece + player info */}
			<div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
				<NextPiece />
				<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
					<div
						style={{
							color: "#444",
							fontSize: 11,
							textTransform: "uppercase",
							letterSpacing: 2,
						}}
					>
						Players
					</div>
					{players
						.filter((p) => p.id !== myId)
						.map((p) => (
							<div
								key={p.id}
								style={{ color: p.alive ? "#aaa" : "#333", fontSize: 13 }}
							>
								{p.alive ? "●" : "○"} {p.username}
							</div>
						))}
				</div>
			</div>

			<GameOver />
		</div>
	);
};
