
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

export type UserRole = 'manager' | 'worker';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  skills?: string[];
  avatar?: string;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isManager: () => boolean;
  isWorker: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: 'user-001',
    name: 'John Manager',
    email: 'manager@example.com',
    role: 'manager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  },
  {
    id: 'user-002',
    name: 'Jane Worker',
    email: 'worker@example.com',
    role: 'worker',
    skills: ['React', 'JavaScript', 'UI Design', 'Content Writing'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(user => user.email === email);
    
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      throw new Error('Invalid email or password');
    }
    setLoading(false);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    
    // Force a page reload after logout to clear any cached state
    window.location.href = '/login';
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const isManager = () => currentUser?.role === 'manager';
  
  const isWorker = () => currentUser?.role === 'worker';

  const value = {
    currentUser,
    loading,
    login,
    logout,
    isManager,
    isWorker,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
