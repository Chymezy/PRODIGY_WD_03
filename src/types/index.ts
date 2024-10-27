export type Player = 'X' | 'O' | null;

export interface GameState {
  board: Player[];
  currentPlayer: Player;
  winner: Player | 'draw' | null;
  gameMode: 'AI' | 'PVP';
  isGameOver: boolean;
}

export interface UserState {
  id: string | null;
  email: string | null;
  username: string | null;
}

export interface ThemeState {
  isDarkMode: boolean;
}
