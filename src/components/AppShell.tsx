"use client";

import { useAuth } from "@/lib/auth-context";
import { LandingPage } from "./LandingPage";
import { HomeDashboard } from "./HomeDashboard";
import type { GapPost } from "@/lib/types";

type AppShellProps = {
  posts: GapPost[];
  total: number;
  saveReady: boolean;
  supabaseUrl?: string;
};

export function AppShell({ posts, total, saveReady, supabaseUrl }: AppShellProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
      </div>
    );
  }

  if (!user) {
    return <LandingPage total={total} />;
  }

  return (
    <main className="min-h-screen">
      <HomeDashboard
        posts={posts}
        total={total}
        saveReady={saveReady}
        supabaseUrl={supabaseUrl}
      />
      <footer className="mx-auto max-w-7xl px-4 pb-10 pt-4 text-center text-xs text-zinc-500 sm:px-6">
        TrueIdeas is read-only. Every card links back to the original Reddit post.
      </footer>
    </main>
  );
}
