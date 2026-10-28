import {EntitlementProvider} from './context/EntitlementContext';
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
        <LanguageProvider><EntitlementProvider><PostProvider>
          <AppRoutes />
        </PostProvider></EntitlementProvider></LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
