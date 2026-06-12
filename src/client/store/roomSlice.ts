import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { PlayerState } from "../../shared/types";

export interface RoomState {
	roomId: string | null;
	myId: string | null;
	players: PlayerState[];
	error: string | null;
}

const initialState: RoomState = {
	roomId: null,
	myId: null,
	players: [],
	error: null,
};

const roomSlice = createSlice({
	name: "room",
	initialState,
	reducers: {
		setRoom(state, action: PayloadAction<{ roomId: string; myId: string }>) {
			state.roomId = action.payload.roomId;
			state.myId = action.payload.myId;
			state.error = null;
		},
		setPlayers(state, action: PayloadAction<PlayerState[]>) {
			state.players = action.payload;
		},
		setError(state, action: PayloadAction<string>) {
			state.error = action.payload;
		},
		clearError(state) {
			state.error = null;
		},
		resetRoom() {
			return initialState;
		},
	},
});

export const { setRoom, setPlayers, setError, clearError, resetRoom } = roomSlice.actions;
export default roomSlice.reducer;
