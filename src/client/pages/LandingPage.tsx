import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LandingPage = () => {
	const navigate = useNavigate();
	const [room, setRoom] = useState("");
	const [playerName, setPlayerName] = useState("");
	const [error, setError] = useState("");

	const handleJoin = () => {
		if (!room.trim()) return setError("Room name is required");
		if (!playerName.trim()) return setError("Player name is required");
		if (!/^[a-zA-Z0-9_-]+$/.test(room))
			return setError("Room name: letters, numbers, - _ only");
		if (!/^[a-zA-Z0-9_-]+$/.test(playerName))
			return setError("Player name: letters, numbers, - _ only");
		navigate(`/${room.trim()}/${playerName.trim()}`);
	};

	const handleKey = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") handleJoin();
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
			<div style={{ fontSize: 48, color: "#f00000", letterSpacing: 6, fontWeight: "bold" }}>
				RED TETRIS
			</div>

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: 16,
					width: 320,
					padding: 32,
					border: "1px solid #222",
					borderRadius: 8,
					background: "#111",
				}}
			>
				<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
					<label
						style={{
							color: "#666",
							fontSize: 11,
							textTransform: "uppercase",
							letterSpacing: 2,
						}}
					>
						Room
					</label>
					<input
						value={room}
						onChange={(e) => {
							setRoom(e.target.value);
							setError("");
						}}
						onKeyDown={handleKey}
						placeholder="my-room"
						style={{
							background: "#0d0d0d",
							border: "1px solid #333",
							borderRadius: 4,
							padding: "10px 12px",
							color: "white",
							fontFamily: "monospace",
							fontSize: 15,
							outline: "none",
						}}
					/>
				</div>

				<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
					<label
						style={{
							color: "#666",
							fontSize: 11,
							textTransform: "uppercase",
							letterSpacing: 2,
						}}
					>
						Player name
					</label>
					<input
						value={playerName}
						onChange={(e) => {
							setPlayerName(e.target.value);
							setError("");
						}}
						onKeyDown={handleKey}
						placeholder="player1"
						style={{
							background: "#0d0d0d",
							border: "1px solid #333",
							borderRadius: 4,
							padding: "10px 12px",
							color: "white",
							fontFamily: "monospace",
							fontSize: 15,
							outline: "none",
						}}
					/>
				</div>

				{error && <div style={{ color: "#f00000", fontSize: 12 }}>{error}</div>}

				<button
					onClick={handleJoin}
					style={{
						marginTop: 8,
						padding: "12px",
						background: "#f00000",
						color: "white",
						border: "none",
						borderRadius: 4,
						fontFamily: "monospace",
						fontSize: 16,
						cursor: "pointer",
						letterSpacing: 2,
					}}
				>
					JOIN
				</button>
			</div>

			<div style={{ color: "#333", fontSize: 12, textAlign: "center" }}>
				or navigate directly to <span style={{ color: "#444" }}>/#/room/playername</span>
			</div>
		</div>
	);
};
