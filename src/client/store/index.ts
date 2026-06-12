import { configureStore } from "@reduxjs/toolkit";
import roomReducer from "./roomSlice";
import gameReducer from "./gameSlice";

export const store = configureStore({
	reducer: {
		room: roomReducer,
		game: gameReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
