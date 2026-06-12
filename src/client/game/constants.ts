export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const TICK_INTERVAL_MS = 500; // piece falls every 500ms

export const PIECE_COLORS: Record<string, string> = {
	I: "#00f0f0",
	J: "#0000f0",
	L: "#f0a000",
	O: "#f0f000",
	S: "#00f000",
	T: "#a000f0",
	Z: "#f00000",
	GHOST: "rgba(255,255,255,0.15)",
	PENALTY: "#555555",
};
