import { configureStore } from "@reduxjs/toolkit";
import roomReducer from "./roomSlice";
import gameReducer from "./gameSlice";
import { socketMiddleware } from "../socket/socketMiddleware";

export const store = configureStore({
	reducer: {
		room: roomReducer,
		game: gameReducer,
	},
	middleware: (getDefault) => getDefault().concat(socketMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
