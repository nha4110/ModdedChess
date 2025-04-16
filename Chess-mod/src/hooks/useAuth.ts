import { useEffect, useState } from 'react';

// Define the user data type
interface UserData {
  username: string;
  wallet: string;
}

export function useAuth() {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    // Optionally, check localStorage or cookies for login
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = (userData: UserData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return { user, login, logout };
}
