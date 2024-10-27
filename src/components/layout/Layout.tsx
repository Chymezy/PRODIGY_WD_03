import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-white dark:bg-gray-900 transition-colors">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
