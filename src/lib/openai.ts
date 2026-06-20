import { CATEGORIES } from "./constants";
import type { TagResult } from "./types";

function fallbackTags(title: string, snippet: string): TagResult {
  const text = `${title} ${snippet}`.toLowerCase();
  let category: (typeof CATEGORIES)[number] = "Other";

  if (/(marketing|seo|ads|email|social media)/.test(text)) category = "Marketing";
  else if (/(invoice|accounting|payment|finance|tax)/.test(text)) category = "Finance";
  else if (/(crm|sales|customer|support)/.test(text)) category = "Operations";
  else if (/(hire|hiring|payroll|hr|team)/.test(text)) category = "HR";
  else if (/(api|developer|code|deploy|github)/.test(text)) category = "DevTools";
  else if (/(shopify|ecommerce|store|checkout)/.test(text)) category = "E-commerce";
  else if (/(workflow|productivity|automate|spreadsheet)/.test(text)) category = "Productivity";
  else if (/(analytics|metrics|dashboard|tracking)/.test(text)) category = "Analytics";
  else if (/(saas|subscription|software|tool)/.test(text)) category = "SaaS";

  const painHints = ["frustrated", "hate", "tired", "struggling", "manual", "pain", "wish"];
  const hits = painHints.filter((hint) => text.includes(hint)).length;
  const pain_score = Math.min(10, 4 + hits * 2);

  return {
    category,
    pain_score,
    summary: snippet,
  };
}

export async function tagPost(
  title: string,
  snippet: string,
): Promise<TagResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return fallbackTags(title, snippet);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You analyze Reddit posts from founders seeking tools. Return JSON with keys: category (one of SaaS, Marketing, Operations, Finance, HR, DevTools, E-commerce, Productivity, Analytics, Other), pain_score (1-10 integer), summary (max 180 chars, plain English pain description).",
          },
          {
            role: "user",
            content: `Title: ${title}\nSnippet: ${snippet}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      return fallbackTags(title, snippet);
    }

    const payload = await response.json();
    const content = payload.choices?.[0]?.message?.content;
    if (!content) return fallbackTags(title, snippet);

    const parsed = JSON.parse(content) as Partial<TagResult>;
    const category = CATEGORIES.includes(parsed.category as (typeof CATEGORIES)[number])
      ? (parsed.category as string)
      : "Other";
    const pain_score = Math.min(10, Math.max(1, Number(parsed.pain_score) || 5));

    return {
      category,
      pain_score,
      summary: (parsed.summary ?? snippet).slice(0, 180),
    };
  } catch {
    return fallbackTags(title, snippet);
  }
}

export async function tagUntaggedPosts(limit = 15) {
  const { getUntaggedPosts, updatePostTags } = await import("./supabase");
  const untagged = await getUntaggedPosts(limit);
  let tagged = 0;

  for (const post of untagged) {
    const sourceSnippet = post.snippet ?? post.title;
    const tags = await tagPost(post.title, sourceSnippet);
    await updatePostTags(post.id, tags);
    tagged += 1;
  }

  return { tagged, pending: Math.max(untagged.length - tagged, 0) };
}
