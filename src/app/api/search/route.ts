import { NextRequest, NextResponse } from "next/server";
import { searchProblems, type SearchMode } from "@/lib/search";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get("mode");
  const query = request.nextUrl.searchParams.get("q") ?? "";

  if (mode !== "subreddit" && mode !== "keyword") {
    return NextResponse.json({ error: "Invalid search mode" }, { status: 400 });
  }

  try {
    const result = await searchProblems(mode as SearchMode, query);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Search failed",
        posts: [],
        message: "Something went wrong while searching.",
        warning: null,
      },
      { status: 200 },
    );
  }
}
