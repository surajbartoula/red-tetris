import { useEffect } from "react";
import { Routes, Route, useParams, Navigate, HashRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { setPending } from "./store/roomSlice";
import { LobbyPage } from "./pages/LobbyPage";
import { GamePage } from "./pages/GamePage";
import { joinRoom, leaveRoom } from "./socket/socketMiddleware";

const RoomRoute = () => {
	const { room, playerName } = useParams<{ room: string; playerName: string }>();
	const dispatch = useDispatch<AppDispatch>();
	const gameStatus = useSelector((s: RootState) => s.game.status);
	const error = useSelector((s: RootState) => s.room.error);

	useEffect(() => {
		if (!room || !playerName) return;

		dispatch(setPending({ roomId: room, username: playerName }));
		dispatch(joinRoom(room, playerName));

		return () => {
			dispatch(leaveRoom());
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
	<HashRouter>
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
							Navigate to{" "}
							<span style={{ color: "#00f0f0" }}>/#/:room/:playerName</span> to play
							<button
								onClick={() => {
									window.location.hash = "#/room1/alice";
								}}
								style={{
									padding: "10px 18px",
									marginTop: "16px",
									background: "inherit",
									color: "#00f0f0",
									border: "none",
									borderRadius: "6px",
									cursor: "pointer",
									fontWeight: "bold",
								}}
							>
								Try Example
							</button>
						</div>
					</div>
				}
			/>
		</Routes>
	</HashRouter>
);
