import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "wouter";
import { type User } from "@shared/schema";
import { getUserProfile, loginUser, registerUser } from "@/lib/api";

type AuthUser = Omit<User, 'password'>;

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    displayName?: string;
    genres?: string[];
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  // Check if user is already logged in
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    
    if (storedUserId) {
      setLoading(true);
      getUserProfile(parseInt(storedUserId))
        .then(userData => {
          setUser(userData);
        })
        .catch(() => {
          // If there's an error fetching the user, clear the stored ID
          localStorage.removeItem('userId');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const userData = await loginUser({ username, password });
      setUser(userData);
      localStorage.setItem('userId', userData.id.toString());
      setLocation('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    displayName?: string;
    genres?: string[];
  }) => {
    setLoading(true);
    try {
      const newUser = await registerUser(userData);
      setUser(newUser);
      localStorage.setItem('userId', newUser.id.toString());
      setLocation('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userId');
    setLocation('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}