import { BOARD_HEIGHT, PIECE_COLORS } from "../game/constants";

interface Props {
	playerId: string;
	username: string;
	spectrum: number[];
	alive: boolean;
}

export const Spectrum = ({ username, spectrum, alive }: Props) => (
	<div
		style={{
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			opacity: alive ? 1 : 0.4,
		}}
	>
		<div
			style={{
				fontSize: 11,
				color: "#aaa",
				marginBottom: 4,
				textAlign: "center",
				maxWidth: 60,
				overflow: "hidden",
				textOverflow: "ellipsis",
				whiteSpace: "nowrap",
			}}
		>
			{username}
		</div>
		<div
			style={{
				display: "flex",
				alignItems: "flex-end",
				gap: 2,
				height: BOARD_HEIGHT * 10,
				padding: "4px",
				border: "1px solid #333",
				backgroundColor: "#0a0a0a",
			}}
		>
			{spectrum.map((height, i) => (
				<div
					key={i}
					style={{
						width: 6,
						height: height * 10,
						backgroundColor: PIECE_COLORS["T"],
						transition: "height 0.1s",
					}}
				/>
			))}
		</div>
	</div>
);
