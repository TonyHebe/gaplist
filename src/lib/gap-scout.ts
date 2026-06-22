import type { GapPost } from "./types";
import type { ScoutAnalysis } from "./scout-types";

function buildPostContext(posts: GapPost[]) {
  return posts
    .slice(0, 35)
    .map(
      (post, index) =>
        `[${index + 1}] id=${post.id} | r/${post.subreddit} | pain=${post.pain_score ?? "?"} | category=${post.category ?? "?"} | ${post.title} | ${post.snippet ?? ""}`,
    )
    .join("\n");
}

function fallbackScout(question: string, posts: GapPost[]): ScoutAnalysis {
  const q = question.toLowerCase();
  const ranked = [...posts].sort((a, b) => (b.pain_score ?? 0) - (a.pain_score ?? 0));
  const matched = ranked.filter((post) => {
    const text = `${post.title} ${post.snippet ?? ""} ${post.category ?? ""}`.toLowerCase();
    return q.split(/\s+/).some((word) => word.length > 3 && text.includes(word));
  });
  const picks = (matched.length > 0 ? matched : ranked).slice(0, 4);

  return {
    headline:
      picks.length > 0
        ? `Top signal: ${picks[0].title}`
        : "Not enough saved posts yet — run a fetch first.",
    opportunities: picks.map(
      (post) => `${post.title} (r/${post.subreddit}, pain ${post.pain_score ?? "?"}/10)`,
    ),
    build_ideas: [
      "Bundle the top 3 pains into one narrow workflow tool.",
      "Start with a landing page + waitlist for the highest pain post.",
      "Validate by replying on Reddit threads (read-only — link back, don't spam).",
    ],
    watch_out: "Add OPENAI_API_KEY for deeper Scout briefings.",
    cited_post_ids: picks.map((post) => post.id),
  };
}

export async function runScoutAnalysis(question: string, posts: GapPost[]): Promise<ScoutAnalysis> {
  const trimmed = question.trim();
  if (!trimmed) {
    return {
      headline: "Ask Scout a builder question to get a briefing.",
      opportunities: [],
      build_ideas: [],
      watch_out: "",
      cited_post_ids: [],
    };
  }

  if (posts.length === 0) {
    return {
      headline: "No posts in your database yet.",
      opportunities: ["Run npm run fetch to pull problem posts from Reddit."],
      build_ideas: [],
      watch_out: "Scout needs saved posts before it can analyze trends.",
      cited_post_ids: [],
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return fallbackScout(trimmed, posts);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are TrueIdeas Scout — a founder research analyst. Given Reddit problem posts, answer the user's builder question. Return JSON only with keys: headline (max 120 chars), opportunities (array of 3-5 short bullets), build_ideas (array of 2-4 actionable micro-SaaS ideas), watch_out (one caveat sentence), cited_post_ids (array of post id strings you relied on, from the provided list). Be specific, not generic. Only cite ids that appear in the data.",
          },
          {
            role: "user",
            content: `Question: ${trimmed}\n\nPosts:\n${buildPostContext(posts)}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      return fallbackScout(trimmed, posts);
    }

    const payload = await response.json();
    const content = payload.choices?.[0]?.message?.content;
    if (!content) return fallbackScout(trimmed, posts);

    const parsed = JSON.parse(content) as Partial<ScoutAnalysis>;
    const validIds = new Set(posts.map((post) => post.id));

    return {
      headline: (parsed.headline ?? "Scout briefing ready.").slice(0, 160),
      opportunities: (parsed.opportunities ?? []).slice(0, 6).map(String),
      build_ideas: (parsed.build_ideas ?? []).slice(0, 5).map(String),
      watch_out: (parsed.watch_out ?? "").slice(0, 220),
      cited_post_ids: (parsed.cited_post_ids ?? [])
        .map(String)
        .filter((id) => validIds.has(id))
        .slice(0, 6),
    };
  } catch {
    return fallbackScout(trimmed, posts);
  }
}
