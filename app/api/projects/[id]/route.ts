// app/api/projects/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const baseUrl = `${process.env.STRAPI_URL}/api/projects/${id}`;
    const searchParams = new URLSearchParams({
      'populate[0]': 'Documents'
    });

    const url = `${baseUrl}?${searchParams.toString()}`;
    console.log("Fetching project from:", url);

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
        { message: "Failed to fetch project", error: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log("Project data:", data);
    
    if (!data.data) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Project API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}