import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useParams, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "./socket/socket";
import { setRoom, setError } from "./store/roomSlice";
import type { RootState } from "./store";
import { LobbyPage } from "./pages/LobbyPage";
import { GamePage } from "./pages/GamePage";
import { useSocket } from "./hooks/useSocket";

const RoomRoute = () => {
	const { room, playerName } = useParams<{ room: string; playerName: string }>();
	const dispatch = useDispatch();
	const gameStatus = useSelector((s: RootState) => s.game.status);
	const error = useSelector((s: RootState) => s.room.error);

	useSocket();

	useEffect(() => {
		if (!room || !playerName) return;

		socket.connect();

		socket.on("connect", () => {
			dispatch(setRoom({ roomId: room, myId: socket.id! }));
			socket.emit("join_room", { roomId: room, username: playerName });
		});

		return () => {
			socket.off("connect");
			socket.emit("leave_room");
			socket.disconnect();
		};
	}, [room, playerName, dispatch]);

	if (!room || !playerName) return <Navigate to="/" />;

	if (error) {
		return (
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					minHeight: "100vh",
					background: "#0d0d0d",
					color: "#f00000",
					fontFamily: "monospace",
					fontSize: 18,
				}}
			>
				Error: {error}
			</div>
		);
	}

	return gameStatus === "playing" || gameStatus === "lost" || gameStatus === "won" ? (
		<GamePage />
	) : (
		<LobbyPage />
	);
};

export const App = () => (
	<BrowserRouter>
		<Routes>
			<Route path="/:room/:playerName" element={<RoomRoute />} />
			<Route
				path="*"
				element={
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							minHeight: "100vh",
							background: "#0d0d0d",
							color: "#aaa",
							fontFamily: "monospace",
							flexDirection: "column",
							gap: 16,
						}}
					>
						<div style={{ fontSize: 40, color: "#f00000" }}>RED TETRIS</div>
						<div>
							Navigate to <span style={{ color: "#00f0f0" }}>/:room/:playerName</span>{" "}
							to play
						</div>
					</div>
				}
			/>
		</Routes>
	</BrowserRouter>
);
