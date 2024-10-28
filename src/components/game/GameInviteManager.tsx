import React, { useState, useEffect } from 'react';
import { wsService } from '@/services/websocketService';
import GameInviteNotification from './GameInviteNotification';

interface GameInvite {
  id: string;
  from: {
    id: string;
    username: string;
  };
  timestamp: Date;
}

const GameInviteManager: React.FC = () => {
  const [invites, setInvites] = useState<GameInvite[]>([]);

  useEffect(() => {
    const handleInvite = (message: any) => {
      if (message.type === 'GAME_INVITE') {
        setInvites(prev => [...prev, message.payload]);
      }
    };

    wsService.addMessageHandler(handleInvite);
    return () => wsService.removeMessageHandler(handleInvite);
  }, []);

  const removeInvite = (inviteId: string) => {
    setInvites(prev => prev.filter(invite => invite.id !== inviteId));
  };

  return (
    <>
      {invites.map(invite => (
        <GameInviteNotification
          key={invite.id}
          invite={invite}
          onClose={() => removeInvite(invite.id)}
        />
      ))}
    </>
  );
};

export default GameInviteManager;
