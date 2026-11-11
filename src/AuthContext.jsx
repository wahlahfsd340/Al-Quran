import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api.js';

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    try { return localStorage.getItem('token') || ''; } catch { return ''; }
  });

  const clear = () => {
    setUser(null); setToken('');
    try { localStorage.removeItem('token'); } catch { /* ignore */ }
  };

  useEffect(() => {
    if (!token) return;
    api('/api/auth/me', { token }).then((d) => setUser(d.user)).catch(clear);
  }, [token]);

  const finish = (d) => {
    setUser(d.user); setToken(d.token);
    try { localStorage.setItem('token', d.token); } catch { /* ignore */ }
  };

  const value = {
    user,
    login: async (email, password) => finish(await api('/api/auth/login', { method: 'POST', body: { email, password } })),
    register: async (name, email, password) => finish(await api('/api/auth/register', { method: 'POST', body: { name, email, password } })),
    logout: clear,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
