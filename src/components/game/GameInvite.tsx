import React, { useState } from 'react';
import { wsService } from '@/services/websocketService';
import PlayerSearch from '../profile/PlayerSearch';

interface GameInviteProps {
  onClose: () => void;
}

const GameInvite: React.FC<GameInviteProps> = ({ onClose }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<{ id: string; username: string } | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteSent, setInviteSent] = useState(false);

  const handleInvite = async () => {
    if (!selectedPlayer) return;

    setSending(true);
    setError(null);

    try {
      wsService.send({
        type: 'SEND_INVITE',
        payload: {
          targetUserId: selectedPlayer.id
        }
      });
      setInviteSent(true);
      setTimeout(onClose, 2000); // Close after showing success message
    } catch (err) {
      setError('Failed to send invite');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Invite Player</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {inviteSent && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
            Invite sent to {selectedPlayer?.username}!
          </div>
        )}

        <div className="mb-4">
          <PlayerSearch
            onSelect={setSelectedPlayer}
            selectedPlayer={selectedPlayer}
          />
        </div>

        {selectedPlayer && (
          <div className="mb-4 p-3 bg-primary-light/10 dark:bg-primary-dark/10 rounded-lg">
            Selected: {selectedPlayer.username}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleInvite}
            disabled={!selectedPlayer || sending || inviteSent}
            className="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg
              hover:opacity-90 disabled:opacity-50"
          >
            {sending ? 'Sending...' : inviteSent ? 'Invite Sent!' : 'Send Invite'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameInvite;
