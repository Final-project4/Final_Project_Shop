import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import conf from '../conf/config';
import { getAuthToken } from './auth';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const authToken = getAuthToken();

  useEffect(() => {
    if (authToken) {
      setIsLoggedIn(true);
      fetchUserInfo(authToken);
    }
  }, [authToken]);

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch(`${conf.urlPrefix}/api/users/me?populate=*`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUserInfo(data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const login = (token) => {
    setIsLoggedIn(true);
    fetchUserInfo(token);
  };

  const logout = () => {
    Cookies.remove('authToken');
    setIsLoggedIn(false);
    setUserInfo(null);
  };

  const isAdmin = userInfo && userInfo.role && userInfo.role.name === "Admin";

  return (
    <AuthContext.Provider value={{ isLoggedIn, userInfo, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};