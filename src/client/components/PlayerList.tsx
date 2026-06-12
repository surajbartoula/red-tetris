import { useSelector } from "react-redux";
import type { RootState } from "../store";

export const PlayerList = () => {
	const players = useSelector((s: RootState) => s.room.players);
	const myId = useSelector((s: RootState) => s.room.myId);

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
			{players.map((p) => (
				<div
					key={p.id}
					style={{
						display: "flex",
						alignItems: "center",
						gap: 8,
						padding: "6px 12px",
						background: p.id === myId ? "rgba(255,255,255,0.08)" : "transparent",
						borderRadius: 4,
						border: p.id === myId ? "1px solid #333" : "1px solid transparent",
					}}
				>
					<span style={{ fontSize: 18 }}>{p.isLeader ? "👑" : "🎮"}</span>
					<span
						style={{ color: p.id === myId ? "white" : "#aaa", fontFamily: "monospace" }}
					>
						{p.username}
					</span>
					{!p.alive && (
						<span style={{ fontSize: 11, color: "#666", marginLeft: "auto" }}>☠</span>
					)}
				</div>
			))}
		</div>
	);
};
