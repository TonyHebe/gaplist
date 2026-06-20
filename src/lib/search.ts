import { fetchSubredditPosts, getRedditFetchSource } from "./reddit";
import { searchPostsInDb, upsertPosts } from "./supabase";
import type { GapPost } from "./types";

export type SearchMode = "subreddit" | "keyword";

const QUICK_SEARCH_SUBREDDITS = ["indiehackers", "SaaS", "startups", "microsaas", "sideproject"];

function normalizeSubreddit(value: string) {
  return value.trim().replace(/^r\//i, "");
}

function toGapPost(post: {
  id: string;
  title: string;
  snippet: string;
  subreddit: string;
  permalink: string;
  created_utc: string;
}): GapPost {
  return {
    ...post,
    category: null,
    pain_score: null,
    tagged_at: null,
    fetched_at: new Date().toISOString(),
    saved: false,
    saved_at: null,
  };
}

function matchesKeyword(text: string, keyword: string) {
  return text.toLowerCase().includes(keyword.trim().toLowerCase());
}

async function searchSubredditLive(subreddit: string) {
  try {
    const posts = await fetchSubredditPosts(subreddit, { fast: true });
    return { posts: posts.filter((post) => post.matches), error: null as string | null };
  } catch (error) {
    return {
      posts: [],
      error: error instanceof Error ? error.message : "Reddit fetch failed",
    };
  }
}

async function searchKeywordLive(keyword: string) {
  const results = await Promise.allSettled(
    QUICK_SEARCH_SUBREDDITS.map(async (subreddit) => {
      const posts = await fetchSubredditPosts(subreddit, { fast: true });
      return posts.filter((post) => matchesKeyword(post.text, keyword));
    }),
  );

  const matches = [];
  let lastError: string | null = null;

  for (const result of results) {
    if (result.status === "fulfilled") {
      matches.push(...result.value);
    } else {
      lastError =
        result.reason instanceof Error ? result.reason.message : "Reddit fetch failed";
    }
  }

  return { posts: matches, error: matches.length === 0 ? lastError : null };
}

function dedupePosts<T extends { id: string }>(posts: T[]) {
  const seen = new Set<string>();
  return posts.filter((post) => {
    if (seen.has(post.id)) return false;
    seen.add(post.id);
    return true;
  });
}

export async function searchProblems(mode: SearchMode, query: string) {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      posts: [] as GapPost[],
      source: getRedditFetchSource(),
      liveFetched: 0,
      message: "Enter a subreddit or keyword to search.",
      warning: null as string | null,
    };
  }

  const dbPosts = await searchPostsInDb(mode, trimmed);
  let livePosts: Awaited<ReturnType<typeof searchSubredditLive>>["posts"] = [];
  let warning: string | null = null;

  if (dbPosts.length > 0) {
    return {
      posts: dbPosts,
      source: getRedditFetchSource(),
      liveFetched: 0,
      message: `Found ${dbPosts.length} saved post${dbPosts.length === 1 ? "" : "s"} instantly.`,
      warning: null,
    };
  }

  if (mode === "subreddit") {
    const result = await searchSubredditLive(normalizeSubreddit(trimmed));
    livePosts = result.posts;
    warning = result.error;
  } else {
    const result = await searchKeywordLive(trimmed);
    livePosts = result.posts;
    warning = result.error;
  }

  const payload = dedupePosts(
    livePosts.map((post) => ({
      id: post.id,
      title: post.title,
      snippet: post.snippet,
      subreddit: post.subreddit,
      permalink: post.permalink,
      created_utc: post.created_utc,
    })),
  );

  if (payload.length > 0) {
    await upsertPosts(payload);
  }

  const merged = dedupePosts([
    ...livePosts.map((post) =>
      toGapPost({
        id: post.id,
        title: post.title,
        snippet: post.snippet,
        subreddit: post.subreddit,
        permalink: post.permalink,
        created_utc: post.created_utc,
      }),
    ),
    ...dbPosts,
  ]).sort((a, b) => new Date(b.created_utc).getTime() - new Date(a.created_utc).getTime());

  let message =
    merged.length > 0
      ? `Found ${merged.length} problem post${merged.length === 1 ? "" : "s"}.`
      : mode === "subreddit"
        ? `No problem posts found in r/${normalizeSubreddit(trimmed)}. Try Keyword mode.`
        : `No posts matched "${trimmed}". Try terms like "frustrated with" or "looking for a tool".`;

  if (warning && merged.length > 0) {
    message += " Some results came from saved posts because Reddit was slow or rate-limited.";
  } else if (warning && merged.length === 0) {
    message = `Reddit is busy right now. Wait a minute, or try Subreddit mode with indiehackers. (${warning})`;
  }

  return {
    posts: merged,
    source: getRedditFetchSource(),
    liveFetched: livePosts.length,
    message,
    warning,
  };
}
