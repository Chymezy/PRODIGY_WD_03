import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-md mt-8">
      <div className="container mx-auto px-4 py-6">
        <p className="text-center text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} TicTacToe. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
