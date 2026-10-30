import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PostProvider } from './context/PostContext';
import { useViewportHeight } from './hooks/useViewportHeight';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  useViewportHeight();
  return (
    <BrowserRouter>
      <AuthProvider>
        <PostProvider>
          <AppRoutes />
        </PostProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
