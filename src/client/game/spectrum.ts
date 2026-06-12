import { computeSpectrum } from "./board";
import type { Board } from "./board";

export const getSpectrum = (board: Board): number[] => computeSpectrum(board);
