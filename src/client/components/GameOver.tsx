import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { restartGameAction } from "../socket/socketMiddleware";

export const GameOver = () => {
	const dispatch = useDispatch<AppDispatch>();
	const status = useSelector((s: RootState) => s.game.status);
	const winnerId = useSelector((s: RootState) => s.game.winnerId);
	const myId = useSelector((s: RootState) => s.room.myId);
	const players = useSelector((s: RootState) => s.room.players);
	const roomId = useSelector((s: RootState) => s.room.roomId);
	const isLeader = players.find((p) => p.id === myId)?.isLeader;

	if (status !== "won" && status !== "lost") return null;

	const winner = players.find((p) => p.id === winnerId);
	const iWon = winnerId === myId;

	return (
		<div
			style={{
				position: "fixed",
				inset: 0,
				background: "rgba(0,0,0,0.85)",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				gap: 24,
				zIndex: 100,
			}}
		>
			<div style={{ fontSize: 64 }}>{iWon ? "🏆" : "💀"}</div>
			<div
				style={{
					fontSize: 32,
					fontFamily: "monospace",
					color: iWon ? "#f0f000" : "#f00000",
				}}
			>
				{iWon ? "You Win!" : "Game Over"}
			</div>
			{!iWon && winner && (
				<div style={{ color: "#aaa", fontFamily: "monospace" }}>
					{winner.username} wins!
				</div>
			)}
			{isLeader ? (
				<button
					onClick={() => roomId && dispatch(restartGameAction(roomId))}
					style={{
						padding: "12px 32px",
						background: "#00f0f0",
						color: "#000",
						border: "none",
						fontFamily: "monospace",
						fontSize: 16,
						cursor: "pointer",
						borderRadius: 4,
					}}
				>
					Play Again
				</button>
			) : (
				<div style={{ color: "#666", fontFamily: "monospace", fontSize: 14 }}>
					Waiting for host to restart…
				</div>
			)}
		</div>
	);
};
