import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    name?: string
  ) => Promise<{ error: Error | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Build base URL from current origin + Vite base path
function getBaseUrl() {
  if (typeof window === 'undefined') return '';
  // Vite's BASE_URL is "/HabitChainTracker_prototype1/" in production
  const basePath = import.meta.env.BASE_URL || '/';
  const cleanBasePath = basePath.endsWith('/')
    ? basePath.slice(0, -1)
    : basePath;
  return `${window.location.origin}${cleanBasePath}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Initial session check (important after OAuth redirect)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (
    email: string,
    password: string,
    name?: string
  ): Promise<{ error: Error | null }> => {
    const baseUrl = getBaseUrl();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${baseUrl}/#/auth`,
        data: name ? { full_name: name } : undefined,
      },
    });

    return { error: (error as Error) ?? null };
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ error: Error | null }> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error: (error as Error) ?? null };
  };

  const signInWithGoogle = async (): Promise<{ error: Error | null }> => {
    const baseUrl = getBaseUrl();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // After Google login, send back to our app dashboard
        redirectTo: `${baseUrl}/#/dashboard`,
      },
    });

    // For debugging: see exactly where Supabase is trying to send us
    console.log('Google OAuth URL from Supabase:', data?.url, error);

    return { error: (error as Error) ?? null };
  };

  const signOut = async (): Promise<void> => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (
    email: string
  ): Promise<{ error: Error | null }> => {
    const baseUrl = getBaseUrl();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${baseUrl}/#/auth`,
    });

    return { error: (error as Error) ?? null };
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
