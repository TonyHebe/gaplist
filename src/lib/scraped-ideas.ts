import { getSupabaseAdmin, getSupabasePublic } from "./supabase";
import { IDEA_SUBREDDITS, REDDIT_FETCH_USER_AGENT, FETCH_DELAY_MS } from "./constants";
import type { ScrapedIdea } from "./types";

const IDEA_SIGNALS = [
  "built", "launched", "shipped", "released", "created",
  "made", "introducing", "announcing", "check out",
  "side project", "weekend project", "open source",
  "i made", "i built", "we built", "just launched",
  "show", "feedback", "beta", "mvp", "prototype",
];

function looksLikeIdea(title: string, selftext: string): boolean {
  const combined = `${title} ${selftext}`.toLowerCase();
  return IDEA_SIGNALS.some((signal) => combined.includes(signal));
}

function extractTags(title: string, selftext: string): string[] {
  const text = `${title} ${selftext}`.toLowerCase();
  const tags: string[] = [];
  
  const techTags = [
    "react", "nextjs", "python", "node", "typescript", "javascript",
    "ai", "ml", "saas", "api", "mobile", "ios", "android", "web",
    "chrome extension", "cli", "open source", "free", "beta",
  ];
  
  for (const tag of techTags) {
    if (text.includes(tag)) {
      tags.push(tag);
    }
  }
  
  return tags.slice(0, 5);
}

async function fetchIdeaSubreddit(subreddit: string): Promise<ScrapedIdea[]> {
  const url = `https://www.reddit.com/r/${subreddit}/new.json?limit=25`;
  
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": REDDIT_FETCH_USER_AGENT },
    });

    if (!response.ok) {
      console.error(`Failed to fetch r/${subreddit}: ${response.status}`);
      return [];
    }

    const data = await response.json();
    const children = data?.data?.children ?? [];
    
    const ideas: ScrapedIdea[] = [];
    
    for (const child of children) {
      const post = child.data;
      
      if (!looksLikeIdea(post.title, post.selftext || "")) {
        continue;
      }

      ideas.push({
        id: post.id,
        title: post.title,
        description: (post.selftext || "").slice(0, 500) || null,
        subreddit: post.subreddit,
        permalink: `https://reddit.com${post.permalink}`,
        author: post.author,
        upvotes: post.ups || 0,
        comments_count: post.num_comments || 0,
        tags: extractTags(post.title, post.selftext || ""),
        created_utc: new Date(post.created_utc * 1000).toISOString(),
        fetched_at: new Date().toISOString(),
      });
    }

    return ideas;
  } catch (error) {
    console.error(`Error fetching r/${subreddit}:`, error);
    return [];
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchAllIdeaSubreddits(): Promise<{
  fetched: number;
  inserted: number;
  subreddits: string[];
}> {
  const allIdeas: ScrapedIdea[] = [];
  const fetchedSubreddits: string[] = [];

  for (const subreddit of IDEA_SUBREDDITS) {
    const ideas = await fetchIdeaSubreddit(subreddit);
    allIdeas.push(...ideas);
    fetchedSubreddits.push(subreddit);
    
    if (subreddit !== IDEA_SUBREDDITS[IDEA_SUBREDDITS.length - 1]) {
      await delay(FETCH_DELAY_MS);
    }
  }

  if (allIdeas.length === 0) {
    return { fetched: 0, inserted: 0, subreddits: fetchedSubreddits };
  }

  const supabase = getSupabaseAdmin();
  
  const rows = allIdeas.map((idea) => ({
    id: idea.id,
    title: idea.title,
    description: idea.description,
    subreddit: idea.subreddit,
    permalink: idea.permalink,
    author: idea.author,
    upvotes: idea.upvotes,
    comments_count: idea.comments_count,
    tags: idea.tags,
    created_utc: idea.created_utc,
    fetched_at: idea.fetched_at,
  }));

  const { error, count } = await supabase
    .from("scraped_ideas")
    .upsert(rows, { onConflict: "id", ignoreDuplicates: true, count: "exact" });

  if (error) {
    console.error("Error saving scraped ideas:", error);
    throw error;
  }

  return {
    fetched: allIdeas.length,
    inserted: count ?? allIdeas.length,
    subreddits: fetchedSubreddits,
  };
}

export async function getScrapedIdeas(limit = 30): Promise<ScrapedIdea[]> {
  const supabase = getSupabasePublic();
  
  const { data, error } = await supabase
    .from("scraped_ideas")
    .select("*")
    .order("created_utc", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching scraped ideas:", error);
    return [];
  }

  return (data ?? []) as ScrapedIdea[];
}

export async function deleteOldScrapedIdeas(keepDays = 7): Promise<number> {
  const supabase = getSupabaseAdmin();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - keepDays);

  const { count, error } = await supabase
    .from("scraped_ideas")
    .delete()
    .lt("created_utc", cutoff.toISOString())
    .select();

  if (error) {
    console.error("Error deleting old scraped ideas:", error);
    return 0;
  }

  return count ?? 0;
}
