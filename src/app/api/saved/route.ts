import { NextRequest, NextResponse } from "next/server";
import { formatSupabaseError, setPostSaved } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { postId?: string; saved?: boolean };
    const postId = body.postId?.trim();
    const saved = Boolean(body.saved);

    if (!postId) {
      return NextResponse.json({ error: "postId is required" }, { status: 400 });
    }

    await setPostSaved(postId, saved);
    return NextResponse.json({ ok: true, postId, saved });
  } catch (error) {
    return NextResponse.json({ error: formatSupabaseError(error) }, { status: 500 });
  }
}
