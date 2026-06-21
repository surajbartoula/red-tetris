import type { Middleware } from "@reduxjs/toolkit";
import { socket } from "./socket";
import { setRoom, setPlayers, setError } from "../store/roomSlice";
import {
	startGame,
	setNextPiece,
	addPenalty,
	updateSpectrum,
	removeSpectrum,
	setWinner,
	resetGame,
} from "../store/gameSlice";

// Action types the middleware intercepts (outgoing to server)
export const socketActions = {
	JOIN_ROOM: "socket/joinRoom",
	LEAVE_ROOM: "socket/leaveRoom",
	START_GAME: "socket/startGame",
	RESTART_GAME: "socket/restartGame",
	REQUEST_PIECE: "socket/requestPiece",
	UPDATE_SPECTRUM: "socket/updateSpectrum",
	LINES_CLEARED: "socket/linesCleared",
	PLAYER_LOST: "socket/playerLost",
} as const;

// Action creators
export const joinRoom = (roomId: string, username: string) => ({
	type: socketActions.JOIN_ROOM,
	payload: { roomId, username },
});
export const leaveRoom = () => ({ type: socketActions.LEAVE_ROOM });
export const startGameAction = (roomId: string) => ({
	type: socketActions.START_GAME,
	payload: roomId,
});
export const restartGameAction = (roomId: string) => ({
	type: socketActions.RESTART_GAME,
	payload: roomId,
});
export const requestPiece = (index: number) => ({
	type: socketActions.REQUEST_PIECE,
	payload: index,
});
export const updateSpectrumAction = (spectrum: number[]) => ({
	type: socketActions.UPDATE_SPECTRUM,
	payload: spectrum,
});
export const linesCleared = (count: number) => ({
	type: socketActions.LINES_CLEARED,
	payload: count,
});
export const playerLost = () => ({ type: socketActions.PLAYER_LOST });

export const socketMiddleware: Middleware = (store) => {
	// ── Incoming: server → client ──────────────────────────────
	socket.on("room_updated", ({ roomId, players }) => {
		if (socket.id) store.dispatch(setRoom({ roomId, myId: socket.id }));
		store.dispatch(setPlayers(players));
	});

	socket.on("game_started", () => {
		store.dispatch(startGame());
	});

	socket.on("new_piece", (piece) => {
		store.dispatch(setNextPiece(piece));
	});

	socket.on("receive_penalty", (lines) => {
		store.dispatch(addPenalty(lines));
	});

	socket.on("spectrum_updated", ({ playerId, spectrum }) => {
		store.dispatch(updateSpectrum({ playerId, spectrum }));
	});

	socket.on("player_left", (playerId) => {
		store.dispatch(removeSpectrum(playerId));
	});

	socket.on("game_over", (winnerId) => {
		store.dispatch(setWinner(winnerId));
	});

	socket.on("game_restarted", () => {
		store.dispatch(resetGame());
	});

	socket.on("error_message", (msg) => {
		store.dispatch(setError(msg));
	});

	socket.on("connect", () => {
		const state = store.getState();
		const { pendingRoom, pendingUsername } = state.room;
		if (pendingRoom && pendingUsername) {
			socket.emit("join_room", { roomId: pendingRoom, username: pendingUsername });
		}
	});

	// ── Outgoing: client → server ──────────────────────────────
	return (next) => (action: any) => {
		switch (action.type) {
			case socketActions.JOIN_ROOM:
				if (!socket.connected) {
					socket.connect();
				} else {
					socket.emit("join_room", action.payload);
				}
				break;

			case socketActions.LEAVE_ROOM:
				socket.emit("leave_room");
				socket.disconnect();
				break;

			case socketActions.START_GAME:
				socket.emit("start_game", action.payload);
				break;

			case socketActions.RESTART_GAME:
				socket.emit("restart_game", action.payload);
				break;

			case socketActions.REQUEST_PIECE:
				socket.emit("request_next_piece", action.payload);
				break;

			case socketActions.UPDATE_SPECTRUM:
				socket.emit("update_spectrum", action.payload);
				break;

			case socketActions.LINES_CLEARED:
				socket.emit("lines_cleared", action.payload);
				break;

			case socketActions.PLAYER_LOST:
				socket.emit("player_lost");
				break;
		}

		return next(action);
	};
};
