import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { lockPiece, tick } from "../store/gameSlice";
import { isValidPosition, computeSpectrum } from "../game/board";
import { TICK_INTERVAL_MS } from "../game/constants";
import {
	requestPiece,
	updateSpectrumAction,
	playerLost,
	linesCleared,
} from "../socket/socketMiddleware";

export const useGameLoop = () => {
	const dispatch = useDispatch<AppDispatch>();
	const status = useSelector((s: RootState) => s.game.status);
	const activePiece = useSelector((s: RootState) => s.game.activePiece);
	const board = useSelector((s: RootState) => s.game.board);
	const pieceIndex = useSelector((s: RootState) => s.game.pieceIndex);
	const lastLinesCleared = useSelector((s: RootState) => (s.game as any)._lastLinesCleared ?? 0);

	const lastTickRef = useRef<number>(0);
	const rafRef = useRef<number>(0);
	const prevLinesRef = useRef<number>(0);

	// Request next piece when pieceIndex advances
	useEffect(() => {
		if (status !== "playing") return;
		dispatch(requestPiece(pieceIndex));
	}, [pieceIndex, status, dispatch]);

	// Emit spectrum on every board change
	useEffect(() => {
		if (status !== "playing") return;
		dispatch(updateSpectrumAction(computeSpectrum(board)));
	}, [board, status, dispatch]);

	// Notify server on lines cleared
	useEffect(() => {
		if (lastLinesCleared > 0 && lastLinesCleared !== prevLinesRef.current) {
			prevLinesRef.current = lastLinesCleared;
			dispatch(linesCleared(lastLinesCleared));
		}
	}, [lastLinesCleared, dispatch]);

	// Notify server on loss
	useEffect(() => {
		if (status === "lost") {
			dispatch(playerLost());
		}
	}, [status, dispatch]);

	// Game tick loop
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
