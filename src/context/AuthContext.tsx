import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types/dsa';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { storage } from '../lib/storage';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check initial auth state
    const initializeAuth = async () => {
      if (isSupabaseConfigured) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user) {
            const sUser = data.session.user;
            const profile = storage.loadUserProfile(sUser.id);
            profile.email = sUser.email || profile.email;
            setUser(profile);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Supabase auth check failed:', e);
        }
      }

      // Check local saved user profile or default to guest demo account
      const savedUserRaw = localStorage.getItem('dsa_tracker_current_user_id');
      const userId = savedUserRaw || 'guest_user_default';
      const profile = storage.loadUserProfile(userId);
      setUser(profile);
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const loginWithGoogle = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signInWithOAuth({ provider: 'google' });
    } else {
      // Demo Google login
      const googleUser: UserProfile = {
        id: `user_google_${Date.now()}`,
        email: 'alex.dev@gmail.com',
        name: 'Alex Rivera',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        daily_goal: 3,
        theme: 'dark'
      };
      storage.saveUserProfile(googleUser);
      localStorage.setItem('dsa_tracker_current_user_id', googleUser.id);
      setUser(googleUser);
    }
  };

  const loginWithEmail = async (email: string) => {
    const emailUser: UserProfile = {
      id: `user_email_${email.replace(/[^a-z0-9]/gi, '_')}`,
      email: email,
      name: email.split('@')[0],
      daily_goal: 3,
      theme: 'dark'
    };
    storage.saveUserProfile(emailUser);
    localStorage.setItem('dsa_tracker_current_user_id', emailUser.id);
    setUser(emailUser);
  };

  const loginAsGuest = () => {
    const guestUser: UserProfile = {
      id: 'guest_user_default',
      email: 'guest@dsa-mastery.com',
      name: 'DSA Explorer',
      daily_goal: 3,
      theme: 'dark'
    };
    storage.saveUserProfile(guestUser);
    localStorage.setItem('dsa_tracker_current_user_id', guestUser.id);
    setUser(guestUser);
  };

  const logout = () => {
    if (isSupabaseConfigured) {
      supabase.auth.signOut();
    }
    localStorage.removeItem('dsa_tracker_current_user_id');
    // Switch to clean guest session
    loginAsGuest();
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    storage.saveUserProfile(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        loginWithGoogle,
        loginWithEmail,
        loginAsGuest,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
