import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../Header/Navbar';
import './AppLayout.css';

export function AppLayout() {
  return (
    <div data-overlay-container="true">
      <div data-overlay-container="true">
        <main className="bg-blue-25 min-h-screen app-main-layout md:pb-0">
          <Navbar />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
