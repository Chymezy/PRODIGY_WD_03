import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import AchievementNotification from './AchievementNotification';

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: Date;
}

const AchievementNotificationManager: React.FC = () => {
  const [notifications, setNotifications] = useState<Achievement[]>([]);
  const achievements = useSelector((state: RootState) => state.achievements.achievements);

  useEffect(() => {
    // Check for new achievements
    const newAchievements = achievements.filter(achievement => {
      const unlockTime = new Date(achievement.unlockedAt).getTime();
      return unlockTime > Date.now() - 5000; // Show achievements unlocked in the last 5 seconds
    });

    if (newAchievements.length > 0) {
      setNotifications(prev => [...prev, ...newAchievements]);
    }
  }, [achievements]);

  const removeNotification = (achievementId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== achievementId));
  };

  return (
    <>
      {notifications.map((achievement) => (
        <AchievementNotification
          key={achievement.id}
          achievement={achievement}
          onClose={() => removeNotification(achievement.id)}
        />
      ))}
    </>
  );
};

export default AchievementNotificationManager;
