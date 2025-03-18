// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { refreshAccessToken } from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser?.accessToken) {
      setUser(storedUser);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const getAccessToken = async () => {
    if (!user) return null;
    
    // Check token expiration
    const decoded = jwt.decode(user.accessToken);
    if (decoded.exp * 1000 > Date.now()) return user.accessToken;
    
    // Refresh token if expired
    try {
      const newToken = await refreshAccessToken(user.refreshToken);
      const updatedUser = { ...user, accessToken: newToken.accessToken };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return newToken.accessToken;
    } catch (error) {
      logout();
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);