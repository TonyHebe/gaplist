import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { GapPost } from "./types";

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  if (!adminClient) {
    adminClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return adminClient;
}

export function getSupabasePublic() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function getRecentPosts(limit = 50): Promise<GapPost[]> {
  const supabase = getSupabasePublic();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_utc", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as GapPost[];
}

export async function upsertPosts(
  posts: Array<{
    id: string;
    title: string;
    snippet: string;
    selftext?: string;
    subreddit: string;
    permalink: string;
    created_utc: string;
  }>,
) {
  if (posts.length === 0) return { inserted: 0 };

  const supabase = getSupabaseAdmin();
  const { error, count } = await supabase.from("posts").upsert(posts, {
    onConflict: "id",
    ignoreDuplicates: true,
    count: "exact",
  });

  if (error) throw error;
  return { inserted: count ?? posts.length };
}

export async function getUntaggedPosts(limit = 20): Promise<GapPost[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .is("tagged_at", null)
    .order("created_utc", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as GapPost[];
}

export async function updatePostTags(
  id: string,
  tags: { category: string; pain_score: number; summary: string },
) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("posts")
    .update({
      category: tags.category,
      pain_score: tags.pain_score,
      snippet: tags.summary,
      tagged_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
}

export async function getSavedPosts(): Promise<GapPost[]> {
  const supabase = getSupabasePublic();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("saved", true)
    .order("saved_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as GapPost[];
}

export function formatSupabaseError(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    const message = String((error as { message: string }).message);
    if (message.includes("'saved' column")) {
      return "Save is not set up yet — run supabase/migration-add-saved.sql in the Supabase SQL Editor.";
    }
    return message;
  }

  return "Database request failed";
}

export async function isSaveFeatureReady(): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("posts").select("saved").limit(1);
  return !error;
}

export async function setPostSaved(postId: string, saved: boolean) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("posts")
    .update({
      saved,
      saved_at: saved ? new Date().toISOString() : null,
    })
    .eq("id", postId)
    .select("id");

  if (error) throw error;
  if (!data?.length) {
    throw new Error(`Post "${postId}" was not found in the database`);
  }
}

export async function getPostStats() {
  const supabase = getSupabasePublic();
  const { count, error } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true });

  if (error) throw error;
  return { total: count ?? 0 };
}

export async function searchPostsInDb(mode: "subreddit" | "keyword", query: string): Promise<GapPost[]> {
  const supabase = getSupabasePublic();
  const trimmed = query.trim();
  if (!trimmed) return [];

  if (mode === "subreddit") {
    const subreddit = trimmed.replace(/^r\//i, "");
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .ilike("subreddit", subreddit)
      .order("created_utc", { ascending: false })
      .limit(50);

    if (error) throw error;
    return (data ?? []) as GapPost[];
  }

  const pattern = `%${trimmed}%`;
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .or(`title.ilike.${pattern},snippet.ilike.${pattern},subreddit.ilike.${pattern}`)
    .order("created_utc", { ascending: false })
    .limit(50);

  if (error) throw error;
  return (data ?? []) as GapPost[];
}
