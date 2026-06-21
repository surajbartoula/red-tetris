import { describe, it, expect, vi, beforeEach } from "vitest";
import { socketActions } from "../../src/client/socket/socketMiddleware";

// Mock socket before importing middleware
vi.mock("../../src/client/socket/socket", () => ({
	socket: {
		on: vi.fn(),
		off: vi.fn(),
		emit: vi.fn(),
		connect: vi.fn(),
		disconnect: vi.fn(),
		connected: false,
		id: "mock-socket-id",
	},
}));

import { socketMiddleware } from "../../src/client/socket/socketMiddleware";
import { socket } from "../../src/client/socket/socket";

const createMockStore = (state = {}) => ({
	getState: () => ({
		room: { pendingRoom: "room1", pendingUsername: "alice" },
		game: { status: "idle" },
		...state,
	}),
	dispatch: vi.fn(),
});

const createMiddleware = (store: any) => {
	const next = vi.fn();
	const invoke = (action: any) => socketMiddleware(store)(next)(action);
	return { next, invoke };
};

describe("socketMiddleware", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("calls next for every action", () => {
		const store = createMockStore();
		const { next, invoke } = createMiddleware(store);
		invoke({ type: "unknown/action" });
		expect(next).toHaveBeenCalled();
	});

	it("emits join_room when already connected", () => {
		(socket as any).connected = true;
		const store = createMockStore();
		const { invoke } = createMiddleware(store);
		invoke({ type: socketActions.JOIN_ROOM, payload: { roomId: "r1", username: "alice" } });
		expect(socket.emit).toHaveBeenCalledWith("join_room", { roomId: "r1", username: "alice" });
	});

	it("calls socket.connect when not connected on join_room", () => {
		(socket as any).connected = false;
		const store = createMockStore();
		const { invoke } = createMiddleware(store);
		invoke({ type: socketActions.JOIN_ROOM, payload: { roomId: "r1", username: "alice" } });
		expect(socket.connect).toHaveBeenCalled();
	});

	it("emits leave_room and disconnects", () => {
		const store = createMockStore();
		const { invoke } = createMiddleware(store);
		invoke({ type: socketActions.LEAVE_ROOM });
		expect(socket.emit).toHaveBeenCalledWith("leave_room");
		expect(socket.disconnect).toHaveBeenCalled();
	});

	it("emits start_game", () => {
		const store = createMockStore();
		const { invoke } = createMiddleware(store);
		invoke({ type: socketActions.START_GAME, payload: "room1" });
		expect(socket.emit).toHaveBeenCalledWith("start_game", "room1");
	});

	it("emits restart_game", () => {
		const store = createMockStore();
		const { invoke } = createMiddleware(store);
		invoke({ type: socketActions.RESTART_GAME, payload: "room1" });
		expect(socket.emit).toHaveBeenCalledWith("restart_game", "room1");
	});

	it("emits request_next_piece", () => {
		const store = createMockStore();
		const { invoke } = createMiddleware(store);
		invoke({ type: socketActions.REQUEST_PIECE, payload: 3 });
		expect(socket.emit).toHaveBeenCalledWith("request_next_piece", 3);
	});

	it("emits update_spectrum", () => {
		const store = createMockStore();
		const { invoke } = createMiddleware(store);
		invoke({ type: socketActions.UPDATE_SPECTRUM, payload: [1, 2, 3] });
		expect(socket.emit).toHaveBeenCalledWith("update_spectrum", [1, 2, 3]);
	});

	it("emits lines_cleared", () => {
		const store = createMockStore();
		const { invoke } = createMiddleware(store);
		invoke({ type: socketActions.LINES_CLEARED, payload: 2 });
		expect(socket.emit).toHaveBeenCalledWith("lines_cleared", 2);
	});

	it("emits player_lost", () => {
		const store = createMockStore();
		const { invoke } = createMiddleware(store);
		invoke({ type: socketActions.PLAYER_LOST });
		expect(socket.emit).toHaveBeenCalledWith("player_lost");
	});

	it("passes unknown actions through to next", () => {
		const store = createMockStore();
		const next = vi.fn();
		const action = { type: "some/unknownAction" };
		socketMiddleware(store)(next)(action);
		expect(next).toHaveBeenCalledWith(action);
	});
});
