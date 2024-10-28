export type Player = 'X' | 'O' | null;

export interface GameState {
  board: Player[];
  currentPlayer: Player;
  winner: Player | 'draw' | null;
  gameMode: 'AI' | 'PVP' | 'ONLINE';
  isGameOver: boolean;
  roomId?: string;
  playerSymbol?: Player;
  gameState: 'waiting' | 'playing' | 'finished';
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
  type: 'MOVE' | 'JOIN_ROOM' | 'CREATE_ROOM' | 'GAME_STATE' | 'ERROR' |
        'SEND_INVITE' | 'RESPOND_INVITE' | 'GAME_INVITE' | 'INVITE_RESPONSE' |
        'GAME_START' | 'GAME_OVER' | 'MOVE_MADE' | 'PLAYER_LEFT';
  payload: {
    targetUserId?: string;
    inviteId?: string;
    accept?: boolean;
    roomId?: string;
    position?: number;
    board?: Array<'X' | 'O' | null>;
    currentPlayer?: 'X' | 'O';
    winner?: 'X' | 'O' | 'draw';
    message?: string;
    gameState?: 'waiting' | 'playing' | 'finished';
  };
}
