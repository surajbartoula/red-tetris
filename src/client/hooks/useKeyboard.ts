import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { moveLeft, moveRight, rotate, softDrop, hardDrop } from "../store/gameSlice";

export const useKeyboard = () => {
	const dispatch = useDispatch();
	const status = useSelector((s: RootState) => s.game.status);

	useEffect(() => {
		if (status !== "playing") return;

		const onKeyDown = (e: KeyboardEvent) => {
			switch (e.key) {
				case "ArrowLeft":
					e.preventDefault();
					dispatch(moveLeft());
					break;
				case "ArrowRight":
					e.preventDefault();
					dispatch(moveRight());
					break;
				case "ArrowUp":
					e.preventDefault();
					dispatch(rotate());
					break;
				case "ArrowDown":
					e.preventDefault();
					dispatch(softDrop());
					break;
				case " ":
					e.preventDefault();
					dispatch(hardDrop());
					break;
			}
		};

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [dispatch, status]);
};
