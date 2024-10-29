import React, { useEffect, useState } from 'react';
import { wsService } from '@/services/websocketService';
import GameInviteNotification from './GameInviteNotification';

interface GameInvite {
  inviteId: string;
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
        console.log('Received invite:', message.payload);
        setInvites(prev => [...prev, {
          inviteId: message.payload.inviteId,
          from: message.payload.from,
          timestamp: new Date()
        }]);
      }
    };

    wsService.addMessageHandler(handleInvite);
    return () => wsService.removeMessageHandler(handleInvite);
  }, []);

  const removeInvite = (inviteId: string) => {
    setInvites(prev => prev.filter(invite => invite.inviteId !== inviteId));
  };

  return (
    <>
      {invites.map((invite) => (
        <GameInviteNotification
          key={invite.inviteId}
          invite={{
            id: invite.inviteId,
            from: invite.from,
            timestamp: invite.timestamp
          }}
          onClose={() => removeInvite(invite.inviteId)}
        />
      ))}
    </>
  );
};

export default GameInviteManager;
