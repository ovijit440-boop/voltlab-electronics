'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole } from '@/types/ecommerce';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  login: (email: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => void;
  switchRoleForDemo: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_AUTH_KEY = 'servicingworld_user_session';

const DEFAULT_DEMO_ADMIN: UserProfile = {
  id: 'usr-admin-01',
  email: 'admin@servicingworld.com',
  full_name: 'Lab Director Admin',
  role: 'super_admin',
  phone: '+880 1700-000000',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  created_at: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial session loading
    if (isSupabaseConfigured() && supabase) {
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            full_name: data.user.user_metadata?.full_name || 'Customer',
            role: (data.user.user_metadata?.role as UserRole) || 'customer',
            created_at: data.user.created_at,
          });
        } else {
          loadLocalSession();
        }
        setIsLoading(false);
      });
    } else {
      loadLocalSession();
      setIsLoading(false);
    }
  }, []);

  const loadLocalSession = () => {
    try {
      const stored = localStorage.getItem(STORAGE_AUTH_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // By default, initialize with Demo Admin logged in so Admin and Shop are immediately ready
        setUser(DEFAULT_DEMO_ADMIN);
        localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(DEFAULT_DEMO_ADMIN));
      }
    } catch {
      setUser(DEFAULT_DEMO_ADMIN);
    }
  };

  const login = async (email: string, role: UserRole = 'customer') => {
    setIsLoading(true);
    const mockUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      full_name: email.split('@')[0],
      role,
      created_at: new Date().toISOString(),
    };
    setUser(mockUser);
    localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const logout = async () => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(STORAGE_AUTH_KEY);
    setUser(null);
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...profile };
    setUser(updated);
    localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(updated));
  };

  const switchRoleForDemo = (role: UserRole) => {
    if (!user) return;
    const updated = { ...user, role };
    setUser(updated);
    localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(updated));
  };

  const isAdmin = user?.role === 'super_admin' || user?.role === 'admin';
  const isStaff = isAdmin || user?.role === 'staff';

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin,
        isStaff,
        login,
        logout,
        updateProfile,
        switchRoleForDemo,
      }}
    >
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
