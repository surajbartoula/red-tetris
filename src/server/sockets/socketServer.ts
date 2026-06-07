import { Server as HttpServer } from "http";
import { Server } from "socket.io";

import type { ClientToServerEvents, ServerToClientEvents } from "../../shared/types";

import { registerGameHandlers } from "./gameHandlers";

export const createSocketServer = (httpServer: HttpServer) => {
	const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
		cors: {
			origin: "*",
		},
	});

	io.on("connection", (socket) => {
		console.log(`Client connected: ${socket.id}`);

		registerGameHandlers(io, socket);

		socket.on("disconnect", () => {
			console.log(`Client disconnected: ${socket.id}`);
		});
	});

	return io;
};
