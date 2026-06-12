import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { lockPiece, tick } from "../store/gameSlice";
import { isValidPosition } from "../game/board";
import { socket } from "../socket/socket";
import { computeSpectrum } from "../game/board";
import { TICK_INTERVAL_MS } from "../game/constants";

export const useGameLoop = () => {
	const dispatch = useDispatch();
	const status = useSelector((s: RootState) => s.game.status);
	const activePiece = useSelector((s: RootState) => s.game.activePiece);
	const board = useSelector((s: RootState) => s.game.board);
	const pieceIndex = useSelector((s: RootState) => s.game.pieceIndex);
	const roomId = useSelector((s: RootState) => s.room.roomId);

	const lastTickRef = useRef<number>(0);
	const rafRef = useRef<number>(0);

	// Request next piece whenever pieceIndex changes
	useEffect(() => {
		if (status !== "playing" || !roomId) return;
		socket.emit("request_next_piece", pieceIndex);
	}, [pieceIndex, status, roomId]);

	// Emit spectrum whenever board changes
	useEffect(() => {
		if (status !== "playing") return;
		const spectrum = computeSpectrum(board);
		socket.emit("update_spectrum", spectrum);
	}, [board, status]);

	// Notify server on loss
	useEffect(() => {
		if (status === "lost" && roomId) {
			socket.emit("player_lost");
		}
	}, [status, roomId]);

	useEffect(() => {
		if (status !== "playing") return;

		const loop = (timestamp: number) => {
			if (timestamp - lastTickRef.current >= TICK_INTERVAL_MS) {
				lastTickRef.current = timestamp;

				if (activePiece) {
					const canFall = isValidPosition(board, {
						...activePiece,
						y: activePiece.y + 1,
					});
					if (canFall) {
						dispatch(tick());
					} else {
						dispatch(lockPiece());
					}
				}
			}

			rafRef.current = requestAnimationFrame(loop);
		};

		rafRef.current = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(rafRef.current);
	}, [status, activePiece, board, dispatch]);
};
