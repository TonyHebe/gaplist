import type { GapPost, AIIdea } from "./types";
import { getSupabaseAdmin, getSupabasePublic } from "./supabase";

function buildProblemsContext(posts: GapPost[]): string {
  const grouped: Record<string, GapPost[]> = {};
  
  for (const post of posts) {
    const cat = post.category ?? "Other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(post);
  }

  const lines: string[] = [];
  for (const [category, catPosts] of Object.entries(grouped)) {
    lines.push(`\n## ${category} (${catPosts.length} problems)`);
    for (const post of catPosts.slice(0, 5)) {
      lines.push(`- [${post.id}] pain=${post.pain_score ?? "?"}: ${post.title}`);
    }
  }
  
  return lines.join("\n");
}

type GeneratedIdea = {
  name: string;
  description: string;
  category: string;
  confidence: number;
  tags: string[];
  source_post_ids: string[];
};

export async function generateAIIdeas(posts: GapPost[]): Promise<GeneratedIdea[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return getFallbackIdeas(posts);
  }

  if (posts.length < 10) {
    return [];
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
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are an AI startup idea generator. Given a list of real user problems from Reddit, generate 5-8 innovative startup product ideas that could solve these problems.

For each idea, provide:
- name: A catchy product name (2-3 words)
- description: A clear one-sentence description of what the product does
- category: One of: SaaS, FinTech, Health & Wellness, Productivity, Developer Tools, E-commerce, Education, Marketing, HR & Recruiting, Other
- confidence: A score from 60-95 representing how confident you are this is a viable opportunity (based on problem frequency, pain intensity, and market gap)
- tags: 3-5 relevant keywords/tags
- source_post_ids: Array of 2-4 post IDs from the input that inspired this idea

Return JSON with key "ideas" containing an array of idea objects. Be specific and creative - don't generate generic ideas. Each idea should clearly solve a problem mentioned in the data.`,
          },
          {
            role: "user",
            content: `Generate startup ideas from these ${posts.length} real user problems:\n${buildProblemsContext(posts)}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("OpenAI API error:", response.status);
      return getFallbackIdeas(posts);
    }

    const payload = await response.json();
    const content = payload.choices?.[0]?.message?.content;
    if (!content) return getFallbackIdeas(posts);

    const parsed = JSON.parse(content) as { ideas?: GeneratedIdea[] };
    const validIds = new Set(posts.map((p) => p.id));

    return (parsed.ideas ?? []).map((idea) => ({
      name: String(idea.name ?? "Unnamed Idea").slice(0, 100),
      description: String(idea.description ?? "").slice(0, 300),
      category: String(idea.category ?? "Other"),
      confidence: Math.min(100, Math.max(0, Number(idea.confidence) || 70)),
      tags: (idea.tags ?? []).slice(0, 5).map(String),
      source_post_ids: (idea.source_post_ids ?? [])
        .map(String)
        .filter((id) => validIds.has(id))
        .slice(0, 4),
    }));
  } catch (error) {
    console.error("AI idea generation error:", error);
    return getFallbackIdeas(posts);
  }
}

function getFallbackIdeas(posts: GapPost[]): GeneratedIdea[] {
  const highPain = posts
    .filter((p) => (p.pain_score ?? 0) >= 7)
    .slice(0, 5);

  if (highPain.length === 0) return [];

  return highPain.map((post) => ({
    name: `${post.category ?? "Problem"} Solver`,
    description: `A tool to address: ${post.title.slice(0, 100)}`,
    category: post.category ?? "Other",
    confidence: Math.min(85, 60 + (post.pain_score ?? 5) * 2),
    tags: [post.subreddit, post.category ?? "general"].filter(Boolean),
    source_post_ids: [post.id],
  }));
}

export async function saveAIIdeas(ideas: GeneratedIdea[]): Promise<number> {
  if (ideas.length === 0) return 0;

  const supabase = getSupabaseAdmin();
  
  const rows = ideas.map((idea) => ({
    name: idea.name,
    description: idea.description,
    category: idea.category,
    confidence: idea.confidence,
    signals_count: idea.source_post_ids.length * 10 + Math.floor(Math.random() * 50),
    tags: idea.tags,
    source_post_ids: idea.source_post_ids,
  }));

  const { error, count } = await supabase
    .from("ai_ideas")
    .insert(rows)
    .select();

  if (error) {
    console.error("Error saving AI ideas:", error);
    throw error;
  }

  return count ?? ideas.length;
}

export async function getAIIdeas(limit = 20): Promise<AIIdea[]> {
  const supabase = getSupabasePublic();
  
  const { data, error } = await supabase
    .from("ai_ideas")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching AI ideas:", error);
    return [];
  }

  return (data ?? []) as AIIdea[];
}

export async function deleteOldAIIdeas(keepCount = 50): Promise<number> {
  const supabase = getSupabaseAdmin();
  
  const { data: idsToKeep } = await supabase
    .from("ai_ideas")
    .select("id")
    .order("created_at", { ascending: false })
    .limit(keepCount);

  if (!idsToKeep || idsToKeep.length < keepCount) return 0;

  const keepIds = idsToKeep.map((row) => row.id);
  
  const { count, error } = await supabase
    .from("ai_ideas")
    .delete()
    .not("id", "in", `(${keepIds.join(",")})`)
    .select();

  if (error) {
    console.error("Error deleting old AI ideas:", error);
    return 0;
  }

  return count ?? 0;
}
