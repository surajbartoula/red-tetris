import type { ClientToServerEvents, ServerToClientEvents } from "../../shared/types";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";

const URL = `${window.location.protocol}//${window.location.hostname}:3000`;

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, {
	autoConnect: false,
});
