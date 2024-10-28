import { WsConnection } from '../types';
import { GameServer } from './gameServer';

interface QueuedPlayer {
  ws: WsConnection;
  rating: number;
  queueTime: number;
}

export class MatchmakingService {
  private queue: QueuedPlayer[] = [];
  private gameServer: GameServer;

  constructor(gameServer: GameServer) {
    this.gameServer = gameServer;
    setInterval(() => this.matchPlayers(), 5000); // Check for matches every 5 seconds
  }

  addToQueue(ws: WsConnection, rating: number = 1000) {
    // Remove player if already in queue
    this.removeFromQueue(ws);

    this.queue.push({
      ws,
      rating,
      queueTime: Date.now()
    });

    ws.send(JSON.stringify({
      type: 'MATCHMAKING_STATUS',
      payload: { status: 'queued' }
    }));
  }

  removeFromQueue(ws: WsConnection) {
    this.queue = this.queue.filter(player => player.ws !== ws);
  }

  private matchPlayers() {
    if (this.queue.length < 2) return;

    // Sort by queue time to prioritize players waiting longer
    this.queue.sort((a, b) => a.queueTime - b.queueTime);

    for (let i = 0; i < this.queue.length; i++) {
      const player1 = this.queue[i];
      if (!player1) continue;

      // Find suitable opponent
      for (let j = i + 1; j < this.queue.length; j++) {
        const player2 = this.queue[j];
        if (!player2) continue;

        // Check if rating difference is acceptable
        // The longer they've waited, the more lenient the rating difference can be
        const waitTime = Math.min(player1.queueTime, player2.queueTime);
        const maxRatingDiff = 200 + Math.floor((Date.now() - waitTime) / 1000) * 10;

        if (Math.abs(player1.rating - player2.rating) <= maxRatingDiff) {
          // Create game for these players
          this.createMatch(player1, player2);
          
          // Remove matched players from queue
          this.queue = this.queue.filter(p => p !== player1 && p !== player2);
          break;
        }
      }
    }
  }

  private createMatch(player1: QueuedPlayer, player2: QueuedPlayer) {
    // Randomly assign X and O
    const isPlayer1X = Math.random() < 0.5;
    const playerX = isPlayer1X ? player1.ws : player2.ws;
    const playerO = isPlayer1X ? player2.ws : player1.ws;

    // Create room and add players
    this.gameServer.createMatchedGame(playerX, playerO);
  }
}
