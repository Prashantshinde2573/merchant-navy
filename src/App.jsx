import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PostProvider } from './context/PostContext';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider><PostProvider>
          <AppRoutes />
        </PostProvider></LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
