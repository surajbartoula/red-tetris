import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { socket } from "../socket/socket";
import { setPlayers, setError } from "../store/roomSlice";
import {
	startGame,
	setNextPiece,
	addPenalty,
	updateSpectrum,
	removeSpectrum,
	setWinner,
	resetGame,
} from "../store/gameSlice";

export const useSocket = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		socket.on("room_updated", ({ players }) => {
			dispatch(setPlayers(players));
		});

		socket.on("game_started", () => {
			dispatch(startGame());
		});

		socket.on("new_piece", (piece) => {
			dispatch(setNextPiece(piece));
		});

		socket.on("receive_penalty", (lines) => {
			dispatch(addPenalty(lines));
		});

		socket.on("spectrum_updated", ({ playerId, spectrum }) => {
			dispatch(updateSpectrum({ playerId, spectrum }));
		});

		socket.on("player_left", (playerId) => {
			dispatch(removeSpectrum(playerId));
		});

		socket.on("game_over", (winnerId) => {
			dispatch(setWinner(winnerId));
		});

		socket.on("game_restarted", () => {
			dispatch(resetGame());
		});

		socket.on("error_message", (msg) => {
			dispatch(setError(msg));
		});

		return () => {
			socket.off("room_updated");
			socket.off("game_started");
			socket.off("new_piece");
			socket.off("receive_penalty");
			socket.off("spectrum_updated");
			socket.off("player_left");
			socket.off("game_over");
			socket.off("game_restarted");
			socket.off("error_message");
		};
	}, [dispatch]);
};
