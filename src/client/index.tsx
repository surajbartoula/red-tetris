import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { io, Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents, PlayerState } from "../shared/types.js";

// Initialize the socket pointing explicitly to your backend port
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:3004");

function App() {
	const [connected, setConnected] = useState(false);
	const [roomPlayers, setRoomPlayers] = useState<PlayerState[]>([]);

	useEffect(() => {
		socket.on("connect", () => {
			setConnected(true);
		});

		socket.on("disconnect", () => {
			setConnected(false);
		});

		// Listen for state changes broadcasted by the server
		socket.on("room_updated", (data) => {
			setRoomPlayers(data.players);
		});

		return () => {
			socket.off("connect");
			socket.off("disconnect");
			socket.off("room_updated");
		};
	}, []);

	const handleJoinTest = () => {
		socket.emit("join_room", { username: "Gamer1", roomId: "42-Lyon" });
	};

	return (
		<div style={{ padding: "20px", fontFamily: "sans-serif" }}>
			<h1>Red Tetris Client</h1>
			<p>Status: {connected ? "🟢 Connected to Server" : "🔴 Disconnected"}</p>

			<button onClick={handleJoinTest} disabled={!connected}>
				Test Join Room "42-Lyon"
			</button>

			<h3>Players in current room:</h3>
			<ul>
				{roomPlayers.map((p) => (
					<li key={p.id}>
						{p.username} {p.isLeader && "(Leader)"}
					</li>
				))}
			</ul>
		</div>
	);
}

const container = document.getElementById("root");
if (container) {
	const root = createRoot(container);
	root.render(<App />);
}
