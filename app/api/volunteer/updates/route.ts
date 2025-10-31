import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "12";
    const category = searchParams.get("category");
    
    // Build URL step by step to avoid syntax errors
    const baseUrl = `${process.env.STRAPI_URL}/api/volunteer-articles`;
    const params = new URLSearchParams({
      'pagination[page]': page,
      'pagination[pageSize]': pageSize,
      'sort': 'publishedAt:desc',
      'populate[0]': 'cover',
      'populate[1]': 'author',
      'populate[2]': 'category'
    });
    
    if (category && category !== "all") {
      params.set('filters[category][slug][$eq]', category);
    }

    const url = `${baseUrl}?${params.toString()}`;
    console.log("Fetching volunteer updates from:", url); // Debug log

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
        { message: "Failed to fetch volunteer updates", error: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log("Volunteer updates fetched successfully:", data.data?.length || 0); // Debug log
    return NextResponse.json(data);
  } catch (error) {
    console.error("Volunteer updates API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}