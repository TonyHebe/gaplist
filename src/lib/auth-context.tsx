"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { User, Session, SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "./supabase-browser";

interface AuthUser extends User {
  plan?: string;
  displayName?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Keep a stable reference to the supabase client
  const supabaseRef = useRef<SupabaseClient | null>(null);
  if (!supabaseRef.current) {
    supabaseRef.current = createClient();
  }
  const supabase = supabaseRef.current;

  async function fetchUserData(authUser: User | null) {
    if (!authUser) {
      setUser(null);
      return;
    }

    try {
      const { data: userData } = await supabase
        .from("users")
        .select("plan, name")
        .eq("id", authUser.id)
        .single();

      setUser({
        ...authUser,
        plan: userData?.plan ?? "free",
        displayName:
          userData?.name ??
          authUser.user_metadata?.name ??
          authUser.user_metadata?.full_name ??
          authUser.email?.split("@")[0],
      });
    } catch {
      // If the users table query fails, still set the user with defaults
      setUser({
        ...authUser,
        plan: "free",
        displayName:
          authUser.user_metadata?.name ??
          authUser.user_metadata?.full_name ??
          authUser.email?.split("@")[0],
      });
    }
  }

  useEffect(() => {
    let mounted = true;

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      await fetchUserData(session?.user ?? null);
      if (mounted) setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;
        setSession(session);
        await fetchUserData(session?.user ?? null);
        if (mounted) setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }

  async function refreshUser() {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    await fetchUserData(authUser);
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
