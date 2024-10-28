export type Player = 'X' | 'O' | null;

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
    board?: Array<Player>;
    currentPlayer?: Player;
    winner?: Player | 'draw';
    message?: string;
    gameState?: 'waiting' | 'playing' | 'finished';
  };
}

export interface LeaderboardEntry {
  username: string;
  rating: number;
  wins: number;
  gamesPlayed: number;
  winRate: number;
}

export interface GameReplay {
  id: string;
  playerX: {
    username: string;
  };
  playerO: {
    username: string;
  };
  winner: Player | 'draw';
  moves: Array<{
    player: Player;
    position: number;
    timestamp: Date;
  }>;
  startTime: Date;
  endTime: Date;
}
