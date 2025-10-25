// app/api/categories/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      `${process.env.STRAPI_URL}/api/categories?populate=cover&sort=name:asc`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Strapi API error:", res.status, errorText);
      return NextResponse.json(
        { message: "Failed to fetch categories", error: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}