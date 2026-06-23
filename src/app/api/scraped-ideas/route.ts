import { NextResponse } from "next/server";
import { getScrapedIdeas } from "@/lib/scraped-ideas";

export const runtime = "nodejs";
export const revalidate = 60;

export async function GET() {
  try {
    const ideas = await getScrapedIdeas(30);
    return NextResponse.json({ ideas });
  } catch (error) {
    console.error("Error fetching scraped ideas:", error);
    return NextResponse.json(
      { error: "Failed to fetch scraped ideas", ideas: [] },
      { status: 500 }
    );
  }
}
