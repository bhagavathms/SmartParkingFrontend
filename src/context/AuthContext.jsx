/**
 * Authentication Context
 * Provides global authentication state and methods
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase.config';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(true);
      setError(null);

      if (user) {
        // Fetch user info from backend
        try {
          const response = await authService.getCurrentUser();
          if (response.success) {
            setUserInfo(response.data);
          }
        } catch (err) {
          console.error('Failed to fetch user info:', err);
          setError('Failed to load user information');
        }
      } else {
        setUserInfo(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    setError(null);
    const result = await authService.login(email, password);
    if (!result.success) {
      setError(result.message);
    }
    return result;
  };

  const register = async (email, password, displayName) => {
    setError(null);
    const result = await authService.register(email, password, displayName);
    if (!result.success) {
      setError(result.message);
    }
    return result;
  };

  const loginWithGoogle = async () => {
    setError(null);
    const result = await authService.loginWithGoogle();
    if (!result.success) {
      setError(result.message);
    }
    return result;
  };

  const logout = async () => {
    setError(null);
    const result = await authService.logout();
    if (result.success) {
      setCurrentUser(null);
      setUserInfo(null);
    } else {
      setError(result.message);
    }
    return result;
  };

  const resetPassword = async (email) => {
    setError(null);
    const result = await authService.resetPassword(email);
    if (!result.success) {
      setError(result.message);
    }
    return result;
  };

  const value = {
    currentUser,
    userInfo,
    loading,
    error,
    isAuthenticated: !!currentUser,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
