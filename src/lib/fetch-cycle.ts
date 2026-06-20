import { SUBREDDITS } from "./constants";
import { tagUntaggedPosts } from "./openai";
import { fetchAllSubreddits, getRedditFetchSource } from "./reddit";
import { upsertPosts } from "./supabase";
import type { FetchResult } from "./types";

export async function runFetchCycle() {
  const source = getRedditFetchSource();
  const batches = await fetchAllSubreddits(SUBREDDITS);
  const results: FetchResult[] = [];
  let totalInserted = 0;

  for (const batch of batches) {
    const payload = batch.matched.map((post) => ({
      id: post.id,
      title: post.title,
      snippet: post.snippet,
      subreddit: post.subreddit,
      permalink: post.permalink,
      created_utc: post.created_utc,
    }));

    let inserted = 0;
    if (payload.length > 0) {
      const upsert = await upsertPosts(payload);
      inserted = upsert.inserted;
      totalInserted += inserted;
    }

    results.push({
      subreddit: batch.subreddit,
      fetched: batch.fetched,
      matched: batch.matched.length,
      inserted,
      tagged: 0,
      error: batch.error,
    });
  }

  const tagging = await tagUntaggedPosts(20);

  return {
    ok: true as const,
    source,
    results,
    totalInserted,
    tagging,
    ranAt: new Date().toISOString(),
  };
}
