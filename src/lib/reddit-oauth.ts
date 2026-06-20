import { POSTS_PER_SUBREDDIT, REDDIT_USER_AGENT } from "./constants";

type OAuthConfig = {
  clientId: string;
  clientSecret: string;
  username: string;
  password: string;
};

type TokenCache = {
  token: string;
  expiresAt: number;
};

let tokenCache: TokenCache | null = null;

export function getOAuthConfig(): OAuthConfig | null {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  const username = process.env.REDDIT_USERNAME;
  const password = process.env.REDDIT_PASSWORD;

  if (!clientId || !clientSecret || !username || !password) {
    return null;
  }

  return {
    clientId,
    clientSecret,
    username: username.replace(/^u\//i, ""),
    password,
  };
}

export function isOAuthConfigured() {
  return getOAuthConfig() !== null;
}

async function getAccessToken(config: OAuthConfig) {
  if (tokenCache && Date.now() < tokenCache.expiresAt - 60_000) {
    return tokenCache.token;
  }

  const credentials = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64");
  const body = new URLSearchParams({
    grant_type: "password",
    username: config.username,
    password: config.password,
  });

  const response = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": REDDIT_USER_AGENT,
    },
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Reddit OAuth failed (${response.status}): ${detail}`);
  }

  const payload = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };

  tokenCache = {
    token: payload.access_token,
    expiresAt: Date.now() + payload.expires_in * 1000,
  };

  return payload.access_token;
}

type OAuthListingChild = {
  data: {
    id: string;
    title: string;
    selftext: string;
    subreddit: string;
    permalink: string;
    created_utc: number;
  };
};

type OAuthListing = {
  data: {
    children: OAuthListingChild[];
  };
};

export async function fetchSubredditPostsOAuth(subreddit: string) {
  const config = getOAuthConfig();
  if (!config) {
    throw new Error("Reddit OAuth is not configured");
  }

  const token = await getAccessToken(config);
  const url = `https://oauth.reddit.com/r/${subreddit}/new?limit=${POSTS_PER_SUBREDDIT}&raw_json=1`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": REDDIT_USER_AGENT,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Reddit OAuth returned ${response.status} for r/${subreddit}`);
  }

  const payload = (await response.json()) as OAuthListing;
  return payload.data.children;
}
