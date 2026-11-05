import React, { createContext, useContext, useState } from 'react';
import {readDemoSession,saveDemoSession,clearDemoSession} from '../utils/demoSession';

const AuthContext = createContext(null);

export const DEMO_EMAIL = 'shivhare.yuvraj@gmail.com';
export const DEMO_OTP = '123456';

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return readDemoSession(sessionStorage).isAuthenticated;
  });
  const [currentUser, setCurrentUser] = useState(() => {
    return readDemoSession(sessionStorage).currentUser;
  });

  const sendOtp = (email) => {
    const trimmed = email.trim().toLowerCase();
    if (trimmed === DEMO_EMAIL.toLowerCase()) {
      return { success: true };
    }
    // Allow any email in demo or match exact email
    if (trimmed.includes('@') && trimmed.includes('.')) {
      return { success: true };
    }
    return { success: false, message: 'Please enter a valid email address' };
  };

  const verifyOtp = (otp, email) => {
    const trimmedOtp = otp.trim();
    if (trimmedOtp === DEMO_OTP) {
      setIsAuthenticated(true);
      setCurrentUser((email || DEMO_EMAIL).trim().toLowerCase());
      saveDemoSession(sessionStorage,email||DEMO_EMAIL);
      return { success: true };
    }
    return { success: false, message: 'Invalid verification code. Please check the code and try again.' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    clearDemoSession(sessionStorage);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, sendOtp, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
