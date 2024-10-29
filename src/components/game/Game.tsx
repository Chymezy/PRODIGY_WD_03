import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { wsService } from '@/services/websocketService';
import { makeMove, setGameState } from '@/store/slices/gameSlice';
import { RootState, AppDispatch } from '@/store';
import Board from './Board';
import GameStatus from './GameStatus';
import GameControls from './GameControls';
import GameInvite from './GameInvite';
import GameInviteManager from './GameInviteManager';
import { getAIMove } from '@/utils/gameUtils';

const Game: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { board, currentPlayer, winner, gameState, playerSymbol, gameMode } = useSelector(
    (state: RootState) => state.game
  );
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Show invite modal when switching to online mode
  useEffect(() => {
    if (gameMode === 'ONLINE' && !roomId) {
      setShowInviteModal(true);
    } else {
      setShowInviteModal(false);
    }
  }, [gameMode, roomId]);

  // Handle AI moves
  useEffect(() => {
    if (gameMode === 'AI' && currentPlayer === 'O' && !winner) {
      const timer = setTimeout(() => {
        const aiPosition = getAIMove(board);
        dispatch(makeMove(aiPosition));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gameMode, currentPlayer, board, winner, dispatch]);

  const handleSquareClick = (position: number) => {
    // Don't allow moves if game is over or square is already filled
    if (winner || board[position] !== null) return;

    // Handle different game modes
    switch (gameMode) {
      case 'AI':
        // Only allow X moves in AI mode (player is always X)
        if (currentPlayer === 'X') {
          dispatch(makeMove(position));
        }
        break;

      case 'PVP':
        // Allow moves for both players in PVP mode
        dispatch(makeMove(position));
        break;

      case 'ONLINE':
        // Only allow moves for the current player in online mode
        if (currentPlayer === playerSymbol) {
          wsService.send({
            type: 'MOVE',
            payload: { position }
          });
        }
        break;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <GameStatus />
        <Board 
          board={board}
          onSquareClick={handleSquareClick}
          disabled={
            gameMode === 'AI' 
              ? currentPlayer === 'O' || !!winner
              : gameMode === 'ONLINE'
              ? currentPlayer !== playerSymbol || !!winner
              : !!winner
          }
        />
        <GameControls />

        {/* Show invite modal for online mode */}
        {showInviteModal && (
          <GameInvite onClose={() => setShowInviteModal(false)} />
        )}

        {/* Handle incoming invites */}
        <GameInviteManager />
      </div>
    </div>
  );
};

export default Game;
