import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loginWithGoogle: () => void;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Mock Authentication - Replace with Firebase/Supabase later
  const loginWithGoogle = () => {
    // Simulating a successful Google login as the admin
    setUser({ email: 'sumanthbolla97@gmail.com', name: 'Sumanth Bolla' });
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = user?.email === 'sumanthbolla97@gmail.com';

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};