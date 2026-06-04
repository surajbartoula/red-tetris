export interface PlayerState {
  id: string;
  username: string;
  isLeader: boolean;
  score: number;
}

export interface ServerToClientEvents {
  room_updated: (data: { roomId: string; players: PlayerState[] }) => void;
  game_started: () => void;
}

export interface ClientToServerEvents {
  join_room: (data: { username: string; roomId: string }) => void;
  start_game: (roomId: string) => void;
}
