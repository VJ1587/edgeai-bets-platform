
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="pb-20">
        <Outlet />
      </main>
      <Navigation />
    </div>
  );
};

export default Layout;
