export const SUBREDDITS = [
  "SaaS",
  "indiehackers",
  "startups",
  "microsaas",
  "sideproject",
  "entrepreneur",
  "smallbusiness",
  "AppIdeas",
  "SomebodyMakeThis",
  "freelance",
] as const;

import { PROBLEM_SIGNALS } from "./problem-signals";

export { PROBLEM_SIGNALS };

export const CATEGORIES = [
  "SaaS",
  "Marketing",
  "Operations",
  "Finance",
  "HR",
  "DevTools",
  "E-commerce",
  "Productivity",
  "Analytics",
  "Other",
] as const;

export const REDDIT_USER_AGENT =
  process.env.REDDIT_USER_AGENT ?? "GapList/0.1 (read-only monitor; contact: antoniohebe1@gmail.com)";

// Reddit blocks .json for many clients; RSS works with a standard browser user agent.
export const REDDIT_FETCH_USER_AGENT =
  process.env.REDDIT_FETCH_USER_AGENT ??
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 GapList/0.1";

export const POSTS_PER_SUBREDDIT = 25;
export const FETCH_DELAY_MS = 5000;
