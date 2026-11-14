import React, { createContext, useContext, useState } from 'react';
import {readDemoSession,saveDemoSession,clearDemoSession} from '../utils/demoSession';

import { COMPANY_EMAIL } from '../utils/companyWorkflow';
import { clearRegistration, readRegistration, registeredAccount, saveRegisteredAccount, saveRegistration } from '../utils/demoRegistration';

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

  const signIn = email => {
    saveDemoSession(sessionStorage, email);
    setCurrentUser(email);
    setIsAuthenticated(true);
  };

  const verifyOtp = (otp, email) => {
    if (otp.trim() !== DEMO_OTP) {
      return { success: false, message: 'Invalid verification code. Please check the code and try again.' };
    }
    const address = (email || DEMO_EMAIL).trim().toLowerCase();
    if (address === DEMO_EMAIL || address === COMPANY_EMAIL || registeredAccount(address)) {
      clearRegistration();
      signIn(address);
      return { success: true };
    }
    const pending = readRegistration();
    if (pending?.email !== address) saveRegistration({ email: address });
    return { success: true, registrationRequired: true };
  };

  const completeRegistration = () => {
    const draft = readRegistration();
    if (!draft?.email || !draft.phoneVerified || !draft.name?.trim() || !draft.country ||
        !draft.contactName?.trim() || !draft.jobTitle?.trim() ||
        !draft.ports?.length || !draft.services?.length || !draft.consent) {
      throw new Error('Complete all required registration fields before continuing.');
    }
    const { email, ...profile } = draft;
    saveRegisteredAccount(email, profile);
    signIn(email);
    clearRegistration();
  };

  const logout = () => {
    setIsAuthenticated(false);
    clearDemoSession(sessionStorage);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, sendOtp, verifyOtp, completeRegistration, logout }}>
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
