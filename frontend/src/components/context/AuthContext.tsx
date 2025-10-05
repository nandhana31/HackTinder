// frontend/src/components/context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { userService, UserProfile } from '../services/userService';

interface AuthContextType {
  user: Partial<UserProfile> | null;
  updateProfile: (data: Partial<UserProfile>) => void;
  registerUser: () => Promise<void>;
  isRegistered: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Partial<UserProfile> | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    console.log('Login function called');
    setIsAuthenticated(true);
  };

  const logout = () => {
    console.log('Logout function called');
    setIsAuthenticated(false);
    setUser(null);
    setIsRegistered(false);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    console.log('Updating profile:', data);
    setUser(prev => ({ ...prev, ...data }));
  };

  const registerUser = async () => {
    if (!user || !user.name || !user.email || !user.skills || !user.interests) {
      throw new Error('Incomplete user profile');
    }

    try {
      console.log('Registering user:', user);
      const response = await userService.registerUser({
        name: user.name,
        email: user.email,
        skills: user.skills,
        interests: user.interests,
        idea: user.idea,
      });
      
      console.log('User registered successfully:', response);
      setIsRegistered(true);
    } catch (error) {
      console.error('Failed to register user:', error);
      throw error;
    }
  };

  const value = {
    user,
    updateProfile,
    registerUser,
    isRegistered,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};