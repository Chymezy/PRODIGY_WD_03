import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Layout from './components/layout/Layout';
import AuthGuard from './components/auth/AuthGuard';
import Game from './components/game/Game';
import GameReplayViewer from './components/game/GameReplayViewer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PlayerProfile from './components/profile/PlayerProfile';
import LeaderboardTable from './components/leaderboard/LeaderboardTable';

const App: React.FC = () => {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/leaderboard" element={<LeaderboardTable />} />

            {/* Protected Routes - Require Authentication */}
            <Route element={<AuthGuard />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Game />} />
                <Route path="/game/:roomId" element={<Game />} />
                <Route path="/replay/:gameId" element={<GameReplayViewer />} />
                <Route path="/profile" element={<PlayerProfile />} />
              </Route>
            </Route>

            {/* Catch-all route - Redirect to login */}
            <Route path="*" element={<Login />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
};

export default App;
