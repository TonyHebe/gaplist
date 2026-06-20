import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      utm_source?: string;
      utm_medium?: string;
      utm_campaign?: string;
      ref?: string;
      path?: string;
    };

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("visits").insert({
      utm_source: body.utm_source?.slice(0, 100) ?? null,
      utm_medium: body.utm_medium?.slice(0, 100) ?? null,
      utm_campaign: body.utm_campaign?.slice(0, 100) ?? null,
      ref: body.ref?.slice(0, 100) ?? null,
      path: body.path?.slice(0, 200) ?? null,
    });

    if (error) {
      return NextResponse.json({ ok: false }, { status: 200 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
