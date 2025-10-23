// app/api/events/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "25";

    // Use populate=* to get all fields including media
    const strapiUrl = `${process.env.STRAPI_URL}/api/events?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=Date:desc`;
    console.log("Calling Strapi URL:", strapiUrl);

    const res = await fetch(strapiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    console.log("Strapi response status:", res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Strapi API error:", res.status, res.statusText);
      console.error("Strapi error response:", errorText);
      
      return NextResponse.json(
        { 
          message: "Failed to fetch events from Strapi",
          details: errorText,
          status: res.status 
        },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log("Events fetched successfully:", data.data?.length || 0, "events");
    
    // Log the structure of the first event to see the actual field names
    if (data.data && data.data.length > 0) {
      console.log("First event structure:", JSON.stringify(data.data[0], null, 2));
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Events API error:", error);
    return NextResponse.json(
      { 
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}