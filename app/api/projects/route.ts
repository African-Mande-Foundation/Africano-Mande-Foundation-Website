// app/api/projects/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "12";
    const category = searchParams.get("category");
    const region = searchParams.get("region");
    const state = searchParams.get("state");
    
    const baseUrl = `${process.env.STRAPI_URL}/api/projects`;
    const params = new URLSearchParams({
      'pagination[page]': page,
      'pagination[pageSize]': pageSize,
      'sort': 'createdAt:desc',
      'populate[0]': 'Documents'
    });
    
    // Add filters
    if (category && category !== "all") {
      params.set('filters[Category][$eq]', category);
    }
    
    if (region && region !== "all") {
      params.set('filters[Region][$eq]', region);
    }
    
    if (state && state !== "all") {
      params.set('filters[state][$eq]', state);
    }

    const url = `${baseUrl}?${params.toString()}`;
    console.log("Fetching projects from:", url);

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
        { message: "Failed to fetch projects", error: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log("Projects fetched successfully:", data.data?.length || 0);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Projects API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}