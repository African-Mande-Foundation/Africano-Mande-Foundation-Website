import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Use the correct populate syntax for nested relationships
    const baseUrl = `${process.env.STRAPI_URL}/api/articles`;
    const searchParams = new URLSearchParams({
      "filters[slug][$eq]": slug,
      "populate[0]": "cover",
      "populate[1]": "author",
      "populate[2]": "category",
      "populate[3]": "comments",
      "populate[4]": "comments.user",
      "populate[5]": "comments.replies",
      "populate[6]": "comments.replies.user",
    });

    const url = `${baseUrl}?${searchParams.toString()}`;
    console.log("Fetching article from:", url); // Debug log

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Strapi API error:", res.status, errorText);
      return NextResponse.json(
        { message: "Failed to fetch article", error: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log("Article data:", data); // Debug log

    if (!data.data || data.data.length === 0) {
      return NextResponse.json(
        { message: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: data.data[0], meta: data.meta });
  } catch (error) {
    console.error("Article API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
