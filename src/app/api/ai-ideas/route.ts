import { NextResponse } from "next/server";
import { getAIIdeas } from "@/lib/ai-ideas";

export const runtime = "nodejs";
export const revalidate = 60;

export async function GET() {
  try {
    const ideas = await getAIIdeas(20);
    return NextResponse.json({ ideas });
  } catch (error) {
    console.error("Error fetching AI ideas:", error);
    return NextResponse.json(
      { error: "Failed to fetch AI ideas", ideas: [] },
      { status: 500 }
    );
  }
}
