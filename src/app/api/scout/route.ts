import { NextRequest, NextResponse } from "next/server";
import { runScoutAnalysis } from "@/lib/gap-scout";
import { getRecentPosts } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { question?: string };
    const question = body.question?.trim() ?? "";

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const posts = await getRecentPosts(50);
    const analysis = await runScoutAnalysis(question, posts);
    const citedPosts = posts.filter((post) => analysis.cited_post_ids.includes(post.id));

    return NextResponse.json({
      analysis,
      citedPosts,
      postsAnalyzed: posts.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Scout analysis failed",
      },
      { status: 500 },
    );
  }
}
