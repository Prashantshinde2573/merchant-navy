import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { PostProvider } from './context/PostContext';
import { useViewportHeight } from './hooks/useViewportHeight';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  useViewportHeight();
  return (
    <BrowserRouter>
      <AuthProvider>
        <PostProvider>
          <NotificationProvider><AppRoutes /></NotificationProvider>
        </PostProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
