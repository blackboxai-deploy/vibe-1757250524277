'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType, SignupData } from '@/types';
import { mockDB } from '@/lib/mockDatabase';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('instagramUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        // Verify user still exists in database
        const dbUser = mockDB.getUserById(userData.id);
        if (dbUser) {
          setUser(dbUser);
        } else {
          localStorage.removeItem('instagramUser');
        }
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('instagramUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockDB.getUserByEmail(email);
    
    if (user && password) {
      // In a real app, we would verify the password hash here
      // For MVP, we'll accept any password for existing users
      setUser(user);
      localStorage.setItem('instagramUser', JSON.stringify(user));
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    setLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Check if email or username already exists
      const existingEmail = mockDB.getUserByEmail(userData.email);
      const existingUsername = mockDB.getUserByUsername(userData.username);

      if (existingEmail) {
        setLoading(false);
        throw new Error('Email already exists');
      }

      if (existingUsername) {
        setLoading(false);
        throw new Error('Username already exists');
      }

      // Create new user
      const newUser = mockDB.createUser({
        email: userData.email,
        username: userData.username,
        fullName: userData.fullName,
        bio: '',
        profilePicture: `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/0060153f-8375-49ca-b104-0e9c7aceaf56.png + ' Profile Picture')}`,
        isVerified: false
      });

      setUser(newUser);
      localStorage.setItem('instagramUser', JSON.stringify(newUser));
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('instagramUser');
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
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