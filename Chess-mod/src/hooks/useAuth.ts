// src/hooks/useAuth.ts
import { useEffect, useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState<null | { username: string; wallet: string }>(null);

  useEffect(() => {
    // Optionally, check localStorage or cookies for login
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = (userData: any) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return { user, login, logout };
}
