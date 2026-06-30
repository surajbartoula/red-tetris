import { useEffect } from "react";
import { HashRouter, Routes, Route, useParams, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { setPending } from "./store/roomSlice";
import { LobbyPage } from "./pages/LobbyPage";
import { GamePage } from "./pages/GamePage";
import { joinRoom, leaveRoom } from "./socket/socketMiddleware";
import { LandingPage } from "./pages/LandingPage";

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
		{" "}
		{/* ← was BrowserRouter */}
		<Routes>
			<Route path="/:room/:playerName" element={<RoomRoute />} />
			<Route path="*" element={<LandingPage />} />
		</Routes>
	</HashRouter>
);
