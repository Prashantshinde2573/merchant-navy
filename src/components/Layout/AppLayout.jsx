import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
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

// Post detail is a focused view on mobile/tablet: the app bars give way to the post's own header and action bar.
const POST_DETAIL_ROUTE = /^\/(posts|post|service-requests|my-posts)\/[^/]+\/?$/;

export function AppLayout() {
  const { pathname } = useLocation();
  const isPostDetail = POST_DETAIL_ROUTE.test(pathname);
  return (
    <div data-overlay-container="true">
      <div data-overlay-container="true">
        <main onKeyDown={handleTabNavigation} className={`bg-blue-25 min-h-screen app-main-layout md:pb-0${isPostDetail ? ' is-post-detail' : ''}`}>
          <Navbar />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
