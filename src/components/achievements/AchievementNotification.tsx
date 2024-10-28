import React, { useEffect, useState } from 'react';
import { Achievement } from '@/types';

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({ achievement, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 transition-all duration-300 transform
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className="bg-primary-light dark:bg-primary-dark text-white p-4 rounded-lg shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold">Achievement Unlocked!</h3>
            <p className="text-sm">{achievement.name}</p>
            <p className="text-xs opacity-75">{achievement.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementNotification;
