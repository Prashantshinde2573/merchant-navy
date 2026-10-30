import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../Header/Navbar';
import './AppLayout.css';

function handleTabNavigation(event) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) || event.target.getAttribute('role') !== 'tab') return;
  const list = event.target.closest('[role="tablist"]');
  const tabs = [...(list?.querySelectorAll('[role="tab"]') || [])].filter(tab => !tab.disabled);
  if (!tabs.length) return;
  const index = tabs.indexOf(event.target);
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
  event.preventDefault();
  tabs[next].focus();
  tabs[next].click();
}

export function AppLayout() {
  return (
    <div data-overlay-container="true">
      <div data-overlay-container="true">
        <main onKeyDown={handleTabNavigation} className="bg-blue-25 min-h-screen app-main-layout md:pb-0">
          <Navbar />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
