import { XMLParser } from "fast-xml-parser";
import { POSTS_PER_SUBREDDIT, REDDIT_FETCH_USER_AGENT } from "./constants";
import { fetchWithTimeout } from "./fetch-timeout";

type FetchRssOptions = {
  fast?: boolean;
};

type AtomEntry = {
  title?: string;
  updated?: string;
  id?: string;
  link?:
    | string
    | {
        "@_href"?: string;
        "@_rel"?: string;
      }
    | Array<{
        "@_href"?: string;
        "@_rel"?: string;
      }>;
  content?:
    | string
    | {
        "#text"?: string;
      };
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#32;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function getEntryLink(entry: AtomEntry): string {
  if (!entry.link) return entry.id ?? "";

  if (Array.isArray(entry.link)) {
    const alternate = entry.link.find((item) => item["@_rel"] === "alternate");
    return alternate?.["@_href"] ?? entry.link[0]?.["@_href"] ?? "";
  }

  if (typeof entry.link === "object") {
    return entry.link["@_href"] ?? "";
  }

  return entry.link;
}

function getEntryBody(entry: AtomEntry): string {
  if (!entry.content) return "";
  if (typeof entry.content === "string") return stripHtml(entry.content);
  return stripHtml(entry.content["#text"] ?? "");
}

export type RssPost = {
  title: string;
  body: string;
  permalink: string;
  created_utc: string;
  id: string;
};

function extractPostId(url: string): string {
  const match = url.match(/comments\/([a-z0-9]+)/i);
  return match?.[1] ?? url;
}

export async function fetchSubredditPostsRss(
  subreddit: string,
  options: FetchRssOptions = {},
): Promise<RssPost[]> {
  const url = `https://www.reddit.com/r/${subreddit}/new.rss?limit=${POSTS_PER_SUBREDDIT}`;
  const maxAttempts = options.fast ? 1 : 2;
  const retryDelayMs = options.fast ? 3000 : 8000;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const response = await fetchWithTimeout(
      url,
      {
        headers: {
          "User-Agent": REDDIT_FETCH_USER_AGENT,
          Accept: "application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
        },
        cache: "no-store",
      },
      options.fast ? 10_000 : 15_000,
    );

    if (response.status === 429 && attempt < maxAttempts - 1) {
      await sleep(retryDelayMs);
      continue;
    }

    if (!response.ok) {
      throw new Error(`Reddit RSS returned ${response.status} for r/${subreddit}`);
    }

    const xml = await response.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });
    const parsed = parser.parse(xml) as { feed?: { entry?: AtomEntry | AtomEntry[] } };
    const entries = parsed.feed?.entry;
    const list = Array.isArray(entries) ? entries : entries ? [entries] : [];

    return list.slice(0, POSTS_PER_SUBREDDIT).map((entry) => {
      const permalink = getEntryLink(entry);
      const title = (entry.title ?? "Untitled post").trim();
      const body = getEntryBody(entry);

      return {
        id: extractPostId(permalink),
        title,
        body,
        permalink,
        created_utc: entry.updated ? new Date(entry.updated).toISOString() : new Date().toISOString(),
      };
    });
  }

  throw new Error(`Reddit RSS returned 429 for r/${subreddit}`);
}
