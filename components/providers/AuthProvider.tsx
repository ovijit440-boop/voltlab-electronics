'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole } from '@/types/ecommerce';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: UserProfile;
  isAdmin?: boolean;
  needEmailVerification?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  loginWithSupabase: (email: string, password: string) => Promise<AuthResult>;
  signUpWithSupabase: (
    email: string,
    password: string,
    fullName?: string,
    asAdmin?: boolean
  ) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  refreshSession: () => Promise<void>;
  login: (email: string, role?: UserRole) => Promise<void>;
  switchRoleForDemo: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function resolveUserProfile(sbUser: any): Promise<UserProfile> {
  let role: UserRole = 'customer';

  // 1. Check raw_user_meta_data / user_metadata
  const metaRole = sbUser.user_metadata?.role;
  if (metaRole === 'super_admin' || metaRole === 'admin' || metaRole === 'staff') {
    role = metaRole as UserRole;
  }

  // 2. Check app_metadata
  const appRole = sbUser.app_metadata?.role;
  if (appRole === 'super_admin' || appRole === 'admin') {
    role = appRole as UserRole;
  }

  // 3. Check NEXT_PUBLIC_ADMIN_EMAIL
  const envAdminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase().trim();
  if (envAdminEmail && sbUser.email?.toLowerCase().trim() === envAdminEmail) {
    role = 'super_admin';
  }

  // 4. Try querying profiles table
  if (supabase) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name, phone, avatar_url')
        .eq('id', sbUser.id)
        .maybeSingle();

      if (profile?.role === 'super_admin' || profile?.role === 'admin' || profile?.role === 'staff') {
        role = profile.role;
      }
    } catch {
      // Ignore if table or network error
    }
  }

  return {
    id: sbUser.id,
    email: sbUser.email || '',
    full_name: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'User',
    phone: sbUser.user_metadata?.phone || null,
    avatar_url: sbUser.user_metadata?.avatar_url || null,
    role,
    created_at: sbUser.created_at,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      if (isSupabaseConfigured() && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const profile = await resolveUserProfile(session.user);
            if (mounted) setUser(profile);
          } else {
            if (mounted) setUser(null);
          }
        } catch (err) {
          console.error('Failed to get Supabase session:', err);
          if (mounted) setUser(null);
        } finally {
          if (mounted) setIsLoading(false);
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
          if (session?.user) {
            const profile = await resolveUserProfile(session.user);
            if (mounted) setUser(profile);
          } else {
            if (mounted) setUser(null);
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } else {
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const refreshSession = async () => {
    if (isSupabaseConfigured() && supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const profile = await resolveUserProfile(session.user);
        setUser(profile);
      } else {
        setUser(null);
      }
    }
  };

  const loginWithSupabase = async (email: string, password: string): Promise<AuthResult> => {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase credentials are not configured in .env.local' };
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      if (data.user) {
        const profile = await resolveUserProfile(data.user);
        setUser(profile);
        setIsLoading(false);
        const isAdm = profile.role === 'admin' || profile.role === 'super_admin';
        return { success: true, user: profile, isAdmin: isAdm };
      }

      setIsLoading(false);
      return { success: false, error: 'No user returned from Supabase Auth' };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err?.message || 'Login failed' };
    }
  };

  const signUpWithSupabase = async (
    email: string,
    password: string,
    fullName?: string,
    asAdmin: boolean = false
  ): Promise<AuthResult> => {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase credentials are not configured in .env.local' };
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName || email.split('@')[0],
            role: asAdmin ? 'admin' : 'customer',
          },
        },
      });

      setIsLoading(false);

      if (error) {
        return { success: false, error: error.message };
      }

      const needEmailVerification = !data.session;
      if (data.user && data.session) {
        const profile = await resolveUserProfile(data.user);
        setUser(profile);
      }

      return { success: true, needEmailVerification };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err?.message || 'Sign up failed' };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured() && supabase) {
        await supabase.auth.signOut();
      }
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  const updateProfile = async (profile: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...profile };
    setUser(updated);

    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.updateUser({
        data: {
          full_name: updated.full_name,
          phone: updated.phone,
        },
      });
    }
  };

  // Backwards-compatible mock login for customer sandbox
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
    setIsLoading(false);
  };

  const switchRoleForDemo = (role: UserRole) => {
    if (!user) return;
    setUser({ ...user, role });
  };

  const isAdmin = Boolean(user && (user.role === 'super_admin' || user.role === 'admin'));
  const isStaff = Boolean(isAdmin || user?.role === 'staff');

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin,
        isStaff,
        loginWithSupabase,
        signUpWithSupabase,
        logout,
        updateProfile,
        refreshSession,
        login,
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
