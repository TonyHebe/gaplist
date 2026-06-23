import { NextRequest, NextResponse } from "next/server";
import { getRecentPosts } from "@/lib/supabase";
import { generateAIIdeas, saveAIIdeas, deleteOldAIIdeas } from "@/lib/ai-ideas";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await getRecentPosts(100);
    
    if (posts.length < 10) {
      return NextResponse.json({
        message: "Not enough posts to generate ideas",
        postsCount: posts.length,
        generated: 0,
      });
    }

    const ideas = await generateAIIdeas(posts);
    
    if (ideas.length === 0) {
      return NextResponse.json({
        message: "No ideas generated",
        postsCount: posts.length,
        generated: 0,
      });
    }

    const saved = await saveAIIdeas(ideas);
    const deleted = await deleteOldAIIdeas(50);

    return NextResponse.json({
      message: "AI ideas generated successfully",
      postsAnalyzed: posts.length,
      generated: saved,
      oldDeleted: deleted,
      ideas: ideas.map((i) => ({ name: i.name, category: i.category, confidence: i.confidence })),
    });
  } catch (error) {
    console.error("AI idea generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
