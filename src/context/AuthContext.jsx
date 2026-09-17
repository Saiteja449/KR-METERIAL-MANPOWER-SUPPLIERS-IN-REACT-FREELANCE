import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api.js';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('kr1_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('kr1_token');
  });
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('kr1_token');
    localStorage.removeItem('kr1_user');
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback((newToken, newUser) => {
    localStorage.setItem('kr1_token', newToken);
    localStorage.setItem('kr1_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const refreshUser = useCallback(async () => {
    const currentToken = localStorage.getItem('kr1_token');
    if (!currentToken) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('kr1_user', JSON.stringify(res.user));
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    refreshUser();

    const handleExternalLogout = () => {
      logout();
    };

    window.addEventListener('auth:logout', handleExternalLogout);
    return () => {
      window.removeEventListener('auth:logout', handleExternalLogout);
    };
  }, [refreshUser, logout]);

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ADMIN';

  // Payment is verified if user is Admin OR user's application status is PAYMENT_RECEIVED, APPLICATION_PENDING, CONFIRMED, or REJECTED
  const isPaymentVerified =
    isAdmin ||
    (!!user &&
      user.application?.status !== 'PAYMENT_PENDING' &&
      user.application?.paymentStatus !== 'PENDING');

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        isPaymentVerified,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
