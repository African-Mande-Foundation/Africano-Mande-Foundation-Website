import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const url = `${process.env.STRAPI_URL}/api/volunteer-articles?filters[slug][$eq]=${slug}&populate[0]=cover&populate[1]=author&populate[2]=category`;
    
    console.log("Fetching volunteer update from:", url);

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
        { message: "Failed to fetch volunteer update", error: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();
    
    if (!data.data || data.data.length === 0) {
      return NextResponse.json(
        { message: "Volunteer update not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: data.data[0] });
  } catch (error) {
    console.error("Volunteer update API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}