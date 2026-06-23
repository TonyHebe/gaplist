export type GapPost = {
  id: string;
  title: string;
  snippet: string | null;
  subreddit: string;
  permalink: string;
  created_utc: string;
  category: string | null;
  pain_score: number | null;
  tagged_at: string | null;
  fetched_at: string;
  saved: boolean;
  saved_at: string | null;
};

export type RedditListingChild = {
  data: {
    id: string;
    title: string;
    selftext: string;
    subreddit: string;
    permalink: string;
    created_utc: number;
    url: string;
    is_self: boolean;
  };
};

export type RedditListing = {
  data: {
    children: RedditListingChild[];
  };
};

export type FetchResult = {
  subreddit: string;
  fetched: number;
  matched: number;
  inserted: number;
  tagged: number;
  error?: string;
};

export type TagResult = {
  category: string;
  pain_score: number;
  summary: string;
};

export type AIIdea = {
  id: string;
  name: string;
  description: string;
  category: string;
  confidence: number;
  signals_count: number;
  tags: string[];
  source_post_ids: string[];
  created_at: string;
};
