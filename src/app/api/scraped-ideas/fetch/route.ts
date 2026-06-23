import { NextRequest, NextResponse } from "next/server";
import { fetchAllIdeaSubreddits, deleteOldScrapedIdeas } from "@/lib/scraped-ideas";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await fetchAllIdeaSubreddits();
    const deleted = await deleteOldScrapedIdeas(7);

    return NextResponse.json({
      message: "Scraped ideas fetched successfully",
      ...result,
      oldDeleted: deleted,
    });
  } catch (error) {
    console.error("Scraped ideas fetch error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Fetch failed" },
      { status: 500 }
    );
  }
}
