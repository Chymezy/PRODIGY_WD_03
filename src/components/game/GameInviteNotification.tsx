import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { wsService } from '@/services/websocketService';

interface GameInviteNotificationProps {
  invite: {
    id: string;
    from: {
      id: string;
      username: string;
    };
    timestamp: Date;
  };
  onClose: () => void;
}

const GameInviteNotification: React.FC<GameInviteNotificationProps> = ({ invite, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [responding, setResponding] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, 30000); // Auto close after 30 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleResponse = async (accept: boolean) => {
    setResponding(true);
    try {
      wsService.send({
        type: 'RESPOND_INVITE',
        payload: {
          inviteId: invite.id,
          accept
        }
      });

      if (accept) {
        // Wait for game creation response before navigating
        const timeout = setTimeout(() => {
          setResponding(false);
          onClose();
        }, 5000);

        const handleGameCreated = (message: any) => {
          if (message.type === 'GAME_CREATED') {
            clearTimeout(timeout);
            navigate(`/game/${message.payload.roomId}`);
          }
        };

        wsService.addMessageHandler(handleGameCreated);
        return () => {
          wsService.removeMessageHandler(handleGameCreated);
          clearTimeout(timeout);
        };
      } else {
        onClose();
      }
    } catch (error) {
      console.error('Error responding to invite:', error);
      setResponding(false);
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 transition-all duration-300 transform
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 max-w-sm">
        <div className="mb-3">
          <h3 className="font-bold text-lg">Game Invite</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {invite.from.username} has invited you to play
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleResponse(false)}
            disabled={responding}
            className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100
              dark:hover:bg-gray-700 rounded-lg disabled:opacity-50"
          >
            Decline
          </button>
          <button
            onClick={() => handleResponse(true)}
            disabled={responding}
            className="px-3 py-1 bg-primary-light dark:bg-primary-dark text-white
              rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {responding ? 'Accepting...' : 'Accept'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameInviteNotification;
