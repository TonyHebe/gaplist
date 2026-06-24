import { NextRequest, NextResponse } from "next/server";
import { REDDIT_FETCH_USER_AGENT } from "@/lib/constants";

export const runtime = "nodejs";

type RedditComment = {
  id: string;
  author: string;
  body: string;
  score: number;
  created_utc: number;
  replies?: { data?: { children?: Array<{ kind: string; data: RedditComment }> } };
};

type CommentResponse = {
  id: string;
  author: string;
  body: string;
  score: number;
  created_utc: string;
  depth: number;
};

function flattenComments(
  children: Array<{ kind: string; data: RedditComment }>,
  depth = 0,
  maxDepth = 3
): CommentResponse[] {
  const comments: CommentResponse[] = [];

  for (const child of children) {
    if (child.kind !== "t1") continue;
    
    const data = child.data;
    if (!data.body || data.author === "[deleted]") continue;

    comments.push({
      id: data.id,
      author: data.author,
      body: data.body.slice(0, 1000),
      score: data.score,
      created_utc: new Date(data.created_utc * 1000).toISOString(),
      depth,
    });

    if (depth < maxDepth && data.replies?.data?.children) {
      comments.push(...flattenComments(data.replies.data.children, depth + 1, maxDepth));
    }
  }

  return comments;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const permalink = searchParams.get("permalink");

    if (!permalink) {
      return NextResponse.json({ error: "permalink is required" }, { status: 400 });
    }

    const cleanPermalink = permalink.replace("https://reddit.com", "").replace("https://www.reddit.com", "");
    const url = `https://www.reddit.com${cleanPermalink}.json?limit=50`;

    const response = await fetch(url, {
      headers: { "User-Agent": REDDIT_FETCH_USER_AGENT },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from Reddit", comments: [] },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    const postData = data[0]?.data?.children?.[0]?.data;
    const commentsData = data[1]?.data?.children ?? [];

    const post = postData ? {
      title: postData.title,
      selftext: postData.selftext || null,
      author: postData.author,
      score: postData.ups,
      num_comments: postData.num_comments,
      created_utc: new Date(postData.created_utc * 1000).toISOString(),
      url: postData.url,
    } : null;

    const comments = flattenComments(commentsData).slice(0, 30);

    return NextResponse.json({ post, comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments", comments: [] },
      { status: 500 }
    );
  }
}
