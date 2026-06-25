import { FETCH_DELAY_MS, SUBREDDITS } from "./constants";
import { fetchSubredditPostsOAuth, isOAuthConfigured } from "./reddit-oauth";
import { fetchSubredditPostsRss } from "./reddit-rss";
import { buildSnippet, matchesProblemSignal, toPermalink } from "./utils";

export type NormalizedRedditPost = {
  id: string;
  title: string;
  snippet: string;
  selftext: string;
  subreddit: string;
  permalink: string;
  created_utc: string;
  text: string;
  matches: boolean;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizePost(input: {
  id: string;
  title: string;
  body: string;
  subreddit: string;
  permalink: string;
  created_utc: string;
}): NormalizedRedditPost {
  const text = `${input.title} ${input.body}`.trim();

  return {
    id: input.id,
    title: input.title,
    snippet: buildSnippet(input.title, input.body),
    selftext: input.body,
    subreddit: input.subreddit,
    permalink: toPermalink(input.permalink),
    created_utc: input.created_utc,
    text,
    matches: matchesProblemSignal(text),
  };
}

export function getRedditFetchSource(): "oauth" | "rss" {
  return isOAuthConfigured() ? "oauth" : "rss";
}

export async function fetchSubredditPosts(
  subreddit: string,
  options: { fast?: boolean } = {},
): Promise<NormalizedRedditPost[]> {
  if (isOAuthConfigured()) {
    const children = await fetchSubredditPostsOAuth(subreddit);
    return children.map((child) =>
      normalizePost({
        id: child.data.id,
        title: child.data.title,
        body: child.data.selftext ?? "",
        subreddit: child.data.subreddit,
        permalink: child.data.permalink,
        created_utc: new Date(child.data.created_utc * 1000).toISOString(),
      }),
    );
  }

  const posts = await fetchSubredditPostsRss(subreddit, options);
  return posts.map((post) =>
    normalizePost({
      id: post.id,
      title: post.title,
      body: post.body,
      subreddit,
      permalink: post.permalink,
      created_utc: post.created_utc,
    }),
  );
}

export async function fetchAllSubreddits(subreddits: readonly string[] = SUBREDDITS) {
  const results = [];

  for (const subreddit of subreddits) {
    try {
      const posts = await fetchSubredditPosts(subreddit);
      const matched = posts.filter((post) => post.matches);
      results.push({
        subreddit,
        fetched: posts.length,
        matched,
        error: undefined,
      });
    } catch (error) {
      results.push({
        subreddit,
        fetched: 0,
        matched: [],
        error: error instanceof Error ? error.message : "Unknown fetch error",
      });
    }

    await sleep(FETCH_DELAY_MS);
  }

  return results;
}
