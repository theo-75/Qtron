import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'supervisor' | 'agent';
  organizationId: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

interface SignupData {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  organizationName: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Simulated user database (in production, this would be in a real database)
const USERS_DB = [
  {
    id: '1',
    username: 'admin1',
    password: 'admin1pass',
    email: 'admin@qtron.ai',
    role: 'admin' as const,
    organizationId: 'org-1',
    firstName: 'System',
    lastName: 'Administrator'
  },
  {
    id: '2',
    username: 'staff1',
    password: 'staff1pass',
    email: 'staff1@qtron.ai',
    role: 'agent' as const,
    organizationId: 'org-1',
    firstName: 'Dr. Sarah',
    lastName: 'Johnson'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored authentication on app load
    const storedUser = localStorage.getItem('qtron-auth-user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('qtron-auth-user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = USERS_DB.find(u => u.username === username && u.password === password);
    
    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role,
        organizationId: foundUser.organizationId,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName
      };
      
      setUser(userData);
      localStorage.setItem('qtron-auth-user', JSON.stringify(userData));
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if username already exists
    const existingUser = USERS_DB.find(u => u.username === userData.username);
    if (existingUser) {
      setLoading(false);
      return false;
    }
    
    // Create new user (in production, this would be saved to database)
    const newUser = {
      id: `user-${Date.now()}`,
      username: userData.username,
      password: userData.password,
      email: userData.email,
      role: 'admin' as const,
      organizationId: `org-${Date.now()}`,
      firstName: userData.firstName,
      lastName: userData.lastName
    };
    
    USERS_DB.push(newUser);
    
    // Auto-login after signup
    const userForState: User = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      organizationId: newUser.organizationId,
      firstName: newUser.firstName,
      lastName: newUser.lastName
    };
    
    setUser(userForState);
    localStorage.setItem('qtron-auth-user', JSON.stringify(userForState));
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('qtron-auth-user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}