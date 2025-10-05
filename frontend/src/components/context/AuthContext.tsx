// frontend/src/components/context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { userService, UserProfile } from './frontend/src/services/userService';

interface AuthContextType {
  user: Partial<UserProfile> | null;
  updateProfile: (data: Partial<UserProfile>) => void;
  registerUser: () => Promise<void>;
  isRegistered: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Partial<UserProfile> | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const updateProfile = (data: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...data }));
  };

  const registerUser = async () => {
    if (!user || !user.name || !user.email || !user.skills || !user.interests) {
      throw new Error('Incomplete user profile');
    }

    try {
      const response = await userService.registerUser({
        name: user.name,
        email: user.email,
        skills: user.skills,
        interests: user.interests,
        idea: user.idea,
      });
      
      console.log('User registered:', response);
      setIsRegistered(true);
    } catch (error) {
      console.error('Failed to register user:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, updateProfile, registerUser, isRegistered }}>
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