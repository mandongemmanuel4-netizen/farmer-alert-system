import { createContext, useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('fsdams_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (phone, pin) => {
    const { data } = await api.post('/auth/login', { phone, pin });
    localStorage.setItem('fsdams_token', data.token);
    localStorage.setItem('fsdams_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('fsdams_token');
    localStorage.removeItem('fsdams_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
