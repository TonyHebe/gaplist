import { NextResponse } from "next/server";
import { getPostStats, getRecentPosts } from "@/lib/supabase";

export const runtime = "nodejs";
export const revalidate = 60;

export async function GET() {
  try {
    const [posts, stats] = await Promise.all([getRecentPosts(60), getPostStats()]);
    return NextResponse.json({ posts, stats });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to load posts",
        posts: [],
        stats: { total: 0 },
      },
      { status: 500 },
    );
  }
}
