import { EmptyState } from "@/components/EmptyState";
import { HomeDashboard } from "@/components/HomeDashboard";
import { getPostStats, getRecentPosts, isSaveFeatureReady } from "@/lib/supabase";
import type { GapPost } from "@/lib/types";

function normalizePost(post: GapPost): GapPost {
  return {
    ...post,
    saved: post.saved ?? false,
    saved_at: post.saved_at ?? null,
  };
}

export const revalidate = 60;

export default async function HomePage() {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  let posts: GapPost[] = [];
  let total = 0;
  let saveReady = false;
  let error: string | null = null;

  if (configured) {
    try {
      [posts, { total }, saveReady] = await Promise.all([
        getRecentPosts(60),
        getPostStats(),
        isSaveFeatureReady(),
      ]);
      posts = posts.map(normalizePost);
    } catch (err) {
      error = err instanceof Error ? err.message : "Could not load posts";
    }
  }

  if (!configured) {
    return (
      <main className="min-h-screen">
        <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <EmptyState configured={configured} error={error} />
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {error ? (
        <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
        </div>
      ) : null}
      <HomeDashboard
        posts={posts}
        total={total}
        saveReady={saveReady}
        supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL}
      />
      <footer className="mx-auto max-w-5xl px-4 pb-10 pt-4 text-center text-xs text-zinc-500 sm:px-6">
        GapList is read-only. Every card links back to the original Reddit post.
      </footer>
    </main>
  );
}
