export type Player = 'X' | 'O' | null;

export interface GameState {
  board: Player[];
  currentPlayer: Player;
  winner: Player | 'draw' | null;
  gameMode: 'AI' | 'PVP' | 'ONLINE';
  isGameOver: boolean;
  roomId?: string;
  playerSymbol?: Player;
}

export interface UserState {
  id: string | null;
  email: string | null;
  username: string | null;
}

export interface ThemeState {
  isDarkMode: boolean;
}

export interface GameMessage {
  type: 'MOVE' | 'JOIN_ROOM' | 'CREATE_ROOM' | 'GAME_STATE' | 'ERROR';
  payload: any;
}
