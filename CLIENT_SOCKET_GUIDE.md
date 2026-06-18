# Red Tetris — Client Socket.io Integration Guide

Ce document explique comment le client React/TypeScript doit communiquer avec le serveur Socket.io.

Il sert de référence pour intégrer le côté client sans devoir lire toute la logique serveur.

---

## 1. Connexion Socket.io

Le client doit se connecter au serveur Socket.io.

```ts
import { io } from "socket.io-client";
import type {
	ClientToServerEvents,
	ServerToClientEvents,
} from "../shared/types";

export const socket = io<
	ServerToClientEvents,
	ClientToServerEvents
>("http://localhost:3000");
```

En développement :

```text
Client Vite   -> http://localhost:5173
Server Socket -> http://localhost:3000
```

---

## 2. Types partagés

Les events sont typés dans :

```text
src/shared/types.ts
```

Le client doit utiliser ces types pour éviter les erreurs de payload.

---

# 3. Events Client -> Server

Ces events sont envoyés par le client vers le serveur.

---

## join_room

Permet à un joueur de rejoindre une room.

```ts
socket.emit("join_room", {
	username: "rida",
	roomId: "room1",
});
```

### Payload

```ts
{
	username: string;
	roomId: string;
}
```

### Comportement serveur

- Si la room n'existe pas, elle est créée.
- Le premier joueur devient leader.
- Si le pseudo existe déjà dans la room, le serveur renvoie `error_message`.
- Si le joueur est déjà dans une room, le serveur renvoie `error_message`.
- Si la partie est déjà en cours, le serveur refuse l'entrée.

---

## start_game

Permet au leader de démarrer la partie.

```ts
socket.emit("start_game", "room1");
```

### Payload

```ts
roomId: string
```

### Comportement serveur

- Seul le leader peut démarrer.
- Le serveur passe la partie en état `playing`.
- Le serveur envoie `game_started`.
- Le serveur envoie la première pièce avec `new_piece`.

---

## restart_game

Permet au leader de relancer une partie.

```ts
socket.emit("restart_game", "room1");
```

### Payload

```ts
roomId: string
```

### Comportement serveur

- Seul le leader peut restart.
- Le serveur remet les joueurs en vie.
- Le serveur réinitialise la séquence des pièces.
- Le serveur repasse la partie en état `waiting`.
- Le serveur envoie `game_restarted`.
- Le serveur envoie `room_updated`.

---

## request_next_piece

Demande une pièce précise selon son index dans la séquence commune.

```ts
socket.emit("request_next_piece", 1);
```

### Payload

```ts
pieceIndex: number
```

### Important

Le client doit gérer un compteur local :

```ts
let pieceIndex = 0;
```

Au start, le serveur envoie automatiquement la pièce index `0`.

Donc après `game_started`, la prochaine demande doit commencer à `1`.

Exemple :

```ts
let pieceIndex = 1;

function askNextPiece() {
	socket.emit("request_next_piece", pieceIndex);
	pieceIndex += 1;
}
```

### Pourquoi un index ?

Tous les joueurs doivent recevoir la même séquence de pièces.

Exemple :

```text
index 0 -> T
index 1 -> J
index 2 -> O
```

Même si les joueurs jouent à des vitesses différentes, ils reçoivent la même pièce pour le même index.

---

## update_spectrum

Envoie aux autres joueurs le spectrum du plateau local.

```ts
socket.emit("update_spectrum", [0, 1, 2, 4, 4, 7, 6, 3, 1, 0]);
```

### Payload

```ts
number[]
```

Le tableau représente la hauteur de chaque colonne du board.

Le board Tetris a 10 colonnes, donc le spectrum doit avoir 10 valeurs.

Exemple :

```ts
const spectrum = [0, 0, 2, 5, 5, 8, 7, 2, 1, 0];
```

Cela signifie :

```text
colonne 0 -> hauteur 0
colonne 1 -> hauteur 0
colonne 2 -> hauteur 2
colonne 3 -> hauteur 5
...
```

Le client doit envoyer ce spectrum à chaque changement important du board.

---

## lines_cleared

Informe le serveur que le joueur a supprimé des lignes.

```ts
socket.emit("lines_cleared", 4);
```

### Payload

```ts
count: number
```

### Règle

Si un joueur clear `n` lignes, les adversaires reçoivent `n - 1` lignes de pénalité.

Exemples :

```text
1 ligne  -> 0 pénalité
2 lignes -> 1 pénalité
3 lignes -> 2 pénalités
4 lignes -> 3 pénalités
```

---

## player_lost

Informe le serveur que le joueur a perdu.

```ts
socket.emit("player_lost");
```

### Payload

Aucun.

### Comportement serveur

- Le joueur est marqué comme éliminé.
- Le serveur envoie `room_updated`.
- S'il reste un seul joueur en vie, le serveur envoie `game_over`.

---

## leave_room

Permet au joueur de quitter volontairement la room.

```ts
socket.emit("leave_room");
```

### Payload

Aucun.

### Comportement serveur

- Le joueur est retiré de la room.
- Les autres reçoivent `player_left`.
- Les joueurs reçoivent `room_updated`.
- Si le leader quitte, un nouveau leader est choisi.
- Si la room est vide, elle est supprimée.

---

# 4. Events Server -> Client

Ces events sont reçus par le client depuis le serveur.

---

## room_updated

Envoyé quand la liste des joueurs change.

```ts
socket.on("room_updated", (data) => {
	console.log(data.roomId);
	console.log(data.players);
});
```

### Payload

```ts
{
	roomId: string;
	players: PlayerState[];
}
```

### PlayerState

```ts
{
	id: string;
	username: string;
	isLeader: boolean;
	alive: boolean;
}
```

### Utilisation côté client

- Afficher la liste des joueurs.
- Savoir qui est leader.
- Savoir qui est encore vivant.
- Mettre à jour le lobby.

---

## game_started

Envoyé quand la partie commence.

```ts
socket.on("game_started", () => {
	// switch UI from lobby to game screen
});
```

### Payload

Aucun.

### Utilisation côté client

- Cacher l'écran lobby.
- Afficher le plateau Tetris.
- Initialiser l'état local du jeu.

---

## game_restarted

Envoyé quand le leader relance une partie.

```ts
socket.on("game_restarted", () => {
	// reset local board
});
```

### Payload

Aucun.

### Utilisation côté client

- Réinitialiser le board local.
- Réinitialiser le compteur `pieceIndex`.
- Réinitialiser l'état `gameOver`.

---

## host_changed

Envoyé quand un nouveau leader est choisi.

```ts
socket.on("host_changed", (playerId) => {
	console.log("New host:", playerId);
});
```

### Payload

```ts
playerId: string
```

### Utilisation côté client

- Mettre à jour l'UI du host.
- Afficher ou cacher le bouton `Start Game`.
- Afficher ou cacher le bouton `Restart Game`.

---

## player_left

Envoyé quand un joueur quitte la room.

```ts
socket.on("player_left", (playerId) => {
	console.log("Player left:", playerId);
});
```

### Payload

```ts
playerId: string
```

### Utilisation côté client

- Afficher une notification.
- Exemple : `A player left the room`.

La liste réelle des joueurs doit quand même être mise à jour avec `room_updated`.

---

## new_piece

Envoyé quand le serveur donne une nouvelle pièce.

```ts
socket.on("new_piece", (piece) => {
	console.log("New piece:", piece);
});
```

### Payload

```ts
PieceType
```

### PieceType

```ts
"I" | "J" | "L" | "O" | "S" | "T" | "Z"
```

### Utilisation côté client

- Créer la nouvelle pièce active.
- L'insérer dans le board local.
- Continuer la boucle de jeu.

---

## spectrum_updated

Envoyé quand un adversaire met à jour son spectrum.

```ts
socket.on("spectrum_updated", ({ playerId, spectrum }) => {
	console.log(playerId, spectrum);
});
```

### Payload

```ts
{
	playerId: string;
	spectrum: number[];
}
```

### Utilisation côté client

- Afficher le mini-board de l'adversaire.
- Ne pas afficher tout son plateau.
- Seulement afficher les hauteurs de colonnes.

---

## receive_penalty

Envoyé quand le joueur doit recevoir des lignes de pénalité.

```ts
socket.on("receive_penalty", (lines) => {
	console.log("Penalty lines:", lines);
});
```

### Payload

```ts
lines: number
```

### Utilisation côté client

Ajouter `lines` lignes indestructibles en bas du board local.

Exemple :

```text
receive_penalty: 3
```

Le client ajoute 3 lignes de pénalité.

---

## game_over

Envoyé quand la partie est terminée.

```ts
socket.on("game_over", (winnerId) => {
	console.log("Winner:", winnerId);
});
```

### Payload

```ts
winnerId: string
```

### Utilisation côté client

- Arrêter la boucle de jeu.
- Afficher l'écran de fin.
- Montrer le gagnant.
- Afficher le bouton restart uniquement pour le leader.

---

## error_message

Envoyé quand le serveur refuse une action.

```ts
socket.on("error_message", (message) => {
	console.error(message);
});
```

### Payload

```ts
message: string
```

### Exemples possibles

```text
Only the leader can start the game
Only the leader can restart the game
Username already taken in this room
Cannot join a game that has already started
You are already in a room
Room not found
```

### Utilisation côté client

- Afficher un toast.
- Afficher un message dans le lobby.
- Ne pas crasher l'application.

---

# 5. Flow recommandé côté client

## Join flow

```text
User opens /room1/rida
        ↓
socket connects
        ↓
client emits join_room
        ↓
server emits room_updated
        ↓
client displays lobby
```

---

## Start flow

```text
Leader clicks Start
        ↓
client emits start_game
        ↓
server emits game_started
        ↓
server emits new_piece for index 0
        ↓
client starts game loop
```

---

## Piece flow

```text
Piece is locked on board
        ↓
client clears lines locally
        ↓
client emits lines_cleared if needed
        ↓
client emits update_spectrum
        ↓
client emits request_next_piece with next index
        ↓
server emits new_piece
```

---

## Lose flow

```text
Player cannot spawn new piece
        ↓
client emits player_lost
        ↓
server emits room_updated
        ↓
if one player remains:
        server emits game_over
```

---

## Restart flow

```text
Leader clicks Restart
        ↓
client emits restart_game
        ↓
server emits game_restarted
        ↓
server emits room_updated
        ↓
client resets board and pieceIndex
```

---

# 6. Minimal React hook example

```ts
import { useEffect, useState } from "react";
import { socket } from "./socket";
import type { PieceType, PlayerState, Spectrum } from "../shared/types";

export function useRedTetrisSocket() {
	const [players, setPlayers] = useState<PlayerState[]>([]);
	const [currentPiece, setCurrentPiece] = useState<PieceType | null>(null);
	const [pieceIndex, setPieceIndex] = useState(1);

	useEffect(() => {
		socket.on("room_updated", ({ players }) => {
			setPlayers(players);
		});

		socket.on("game_started", () => {
			setPieceIndex(1);
		});

		socket.on("new_piece", (piece) => {
			setCurrentPiece(piece);
		});

		socket.on("game_restarted", () => {
			setPieceIndex(1);
			setCurrentPiece(null);
		});

		socket.on("error_message", (message) => {
			console.error(message);
		});

		return () => {
			socket.off("room_updated");
			socket.off("game_started");
			socket.off("new_piece");
			socket.off("game_restarted");
			socket.off("error_message");
		};
	}, []);

	const joinRoom = (username: string, roomId: string) => {
		socket.emit("join_room", { username, roomId });
	};

	const startGame = (roomId: string) => {
		socket.emit("start_game", roomId);
	};

	const requestNextPiece = () => {
		socket.emit("request_next_piece", pieceIndex);
		setPieceIndex((current) => current + 1);
	};

	const sendSpectrum = (spectrum: Spectrum) => {
		socket.emit("update_spectrum", spectrum);
	};

	const sendLinesCleared = (count: number) => {
		socket.emit("lines_cleared", count);
	};

	const markAsLost = () => {
		socket.emit("player_lost");
	};

	return {
		players,
		currentPiece,
		joinRoom,
		startGame,
		requestNextPiece,
		sendSpectrum,
		sendLinesCleared,
		markAsLost,
	};
}
```

---

# 7. Responsabilités client / serveur

## Serveur

Le serveur gère :

- les rooms ;
- les joueurs ;
- le leader ;
- start / restart ;
- distribution synchronisée des pièces ;
- pénalités ;
- éliminations ;
- game over ;
- relais des spectrums.

## Client

Le client gère :

- rendu React ;
- board Tetris local ;
- mouvements clavier ;
- collisions ;
- rotations ;
- hard drop / soft drop ;
- clear lines ;
- calcul du spectrum ;
- affichage des adversaires ;
- application des pénalités.

---

# 8. Notes importantes

- Le serveur ne calcule pas les collisions.
- Le serveur ne stocke pas le board complet.
- Le serveur ne calcule pas le spectrum.
- Le client doit envoyer `update_spectrum` après modification de son board.
- Le client doit envoyer `lines_cleared` après suppression de lignes.
- Le client doit envoyer `player_lost` quand une nouvelle pièce ne peut plus apparaître.
- Le client doit demander les pièces avec un index pour garder la même séquence entre joueurs.
