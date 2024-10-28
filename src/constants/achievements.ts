export const ACHIEVEMENTS = {
  FIRST_WIN: {
    id: 'FIRST_WIN',
    name: 'First Victory',
    description: 'Win your first game'
  },
  WINNING_STREAK: {
    id: 'WINNING_STREAK',
    name: 'On Fire',
    description: 'Win 5 games in a row'
  },
  MASTER_PLAYER: {
    id: 'MASTER_PLAYER',
    name: 'Master Player',
    description: 'Reach 1500 rating points'
  },
  VETERAN: {
    id: 'VETERAN',
    name: 'Veteran',
    description: 'Play 100 games'
  },
  PERFECT_GAME: {
    id: 'PERFECT_GAME',
    name: 'Perfect Game',
    description: 'Win a game without letting your opponent make a move'
  }
} as const;
