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
      setTimeout(onClose, 300);
    }, 30000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleResponse = async (accept: boolean) => {
    setResponding(true);
    try {
      console.log('Sending invite response:', { inviteId: invite.id, accept });
      wsService.send({
        type: 'RESPOND_INVITE',
        payload: {
          inviteId: invite.id,
          accept
        }
      });

      if (accept) {
        // Listen for game creation response
        const handleGameCreated = (message: any) => {
          console.log('Received game created message:', message);
          if (message.type === 'GAME_CREATED' && message.payload.roomId) {
            navigate(`/game/${message.payload.roomId}`);
            onClose();
          }
        };

        wsService.addMessageHandler(handleGameCreated);
        // Clean up the handler after 10 seconds if no response
        setTimeout(() => {
          wsService.removeMessageHandler(handleGameCreated);
        }, 10000);
      } else {
        onClose();
      }
    } catch (error) {
      console.error('Error responding to invite:', error);
    } finally {
      setResponding(false);
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 transition-all duration-300 transform z-50
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
