import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const DEMO_EMAIL = 'shivhare.yuvraj@gmail.com';
export const DEMO_OTP = '123456';

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('currentUser') || DEMO_EMAIL;
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
    return { success: false, message: 'Please enter a valid email address (Demo: shivhare.yuvraj@gmail.com)' };
  };

  const verifyOtp = (otp, email) => {
    const trimmedOtp = otp.trim();
    if (trimmedOtp === DEMO_OTP) {
      setIsAuthenticated(true);
      setCurrentUser(email || DEMO_EMAIL);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUser', email || DEMO_EMAIL);
      return { success: true };
    }
    return { success: false, message: 'Invalid verification code. Please enter 123456' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
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
