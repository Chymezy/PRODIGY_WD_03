import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary-light dark:text-primary-dark">
            TicTacToe
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {/* TODO: Uncomment auth-related elements once backend is ready */}
            {/* {user.id ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-700 dark:text-gray-300">
                  {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Login
              </Link>
            )} */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
