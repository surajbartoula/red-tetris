import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { PlayerList } from "../components/PlayerList";
import { startGameAction } from "../socket/socketMiddleware";

export const LobbyPage = () => {
	const dispatch = useDispatch<AppDispatch>();
	const roomId = useSelector((s: RootState) => s.room.roomId);
	const myId = useSelector((s: RootState) => s.room.myId);
	const players = useSelector((s: RootState) => s.room.players);
	const isLeader = players.find((p) => p.id === myId)?.isLeader;

	const handleStart = () => {
		if (roomId) dispatch(startGameAction(roomId));
	};

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#0d0d0d",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				gap: 32,
				fontFamily: "monospace",
			}}
		>
			<div style={{ fontSize: 40, color: "#f00000", letterSpacing: 4 }}>RED TETRIS</div>
			<div style={{ color: "#555", fontSize: 14 }}>
				Room: <span style={{ color: "#00f0f0" }}>{roomId}</span>
			</div>
			<div
				style={{
					minWidth: 280,
					border: "1px solid #222",
					borderRadius: 8,
					padding: 24,
					background: "#111",
				}}
			>
				<div
					style={{
						color: "#666",
						fontSize: 12,
						marginBottom: 16,
						textTransform: "uppercase",
						letterSpacing: 2,
					}}
				>
					Players ({players.length})
				</div>
				<PlayerList />
			</div>
			{isLeader ? (
				<button
					onClick={handleStart}
					style={{
						padding: "14px 40px",
						background: "#f00000",
						color: "white",
						border: "none",
						fontFamily: "monospace",
						fontSize: 18,
						cursor: "pointer",
						borderRadius: 4,
						letterSpacing: 2,
					}}
				>
					START GAME
				</button>
			) : (
				<div style={{ color: "#444", fontSize: 14 }}>Waiting for host to start…</div>
			)}
		</div>
	);
};
