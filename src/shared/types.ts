export interface PlayerState {
	id: string;
	username: string;
	isLeader: boolean;
	alive: boolean;
}

export type PieceType = "I" | "J" | "L" | "O" | "S" | "T" | "Z";

export type Spectrum = number[];

export interface ServerToClientEvents {
	room_updated: (data: { roomId: string; players: PlayerState[] }) => void;

	game_started: () => void;

	host_changed: (playerId: string) => void;

	game_restarted: () => void;

	player_left: (playerId: string) => void;

	new_piece: (piece: PieceType) => void;

	spectrum_updated: (data: { playerId: string; spectrum: Spectrum }) => void;

	receive_penalty: (lines: number) => void;

	game_over: (winnerId: string) => void;

	error_message: (message: string) => void;
}

export interface ClientToServerEvents {
	join_room: (data: { username: string; roomId: string }) => void;

	start_game: (roomId: string) => void;

	leave_room: () => void;

	player_lost: () => void;

	update_spectrum: (spectrum: Spectrum) => void;

	lines_cleared: (count: number) => void;

	request_next_piece: (pieceIndex: number) => void;

	restart_game: (roomId: string) => void;
}
