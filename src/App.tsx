import * as React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  Game,
  Login,
  Register,
  Layout,
  AuthGuard
} from '@/components';

const App: React.FC = () => {
  const { isDarkMode } = useSelector((state: RootState) => state.theme);

  React.useEffect(() => {
    // Apply dark mode to both html and div.dark
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public routes */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            
            {/* Protected routes */}
            <Route element={<AuthGuard />}>
              <Route index element={<Game />} />
            </Route>

            {/* Redirect to login if no match */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
